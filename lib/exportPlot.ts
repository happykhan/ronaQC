export function getSVGString(svgNode: SVGSVGElement): string {
  const serializer = new XMLSerializer()
  let svgString = serializer.serializeToString(svgNode)
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=')
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href')
  return svgString
}

export function svgString2Image(
  svgString: string,
  width: number,
  height: number,
  callback: (blob: Blob) => void
): void {
  const imgsrc =
    'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)))

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return

  canvas.width = width
  canvas.height = height

  const image = new Image()
  image.onload = () => {
    context.clearRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)
    canvas.toBlob((blob) => {
      if (blob) callback(blob)
    })
  }
  image.src = imgsrc
}
