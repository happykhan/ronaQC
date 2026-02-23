import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FileDropZone from '../FileDropZone'

describe('FileDropZone', () => {
  it('renders with label and hint', () => {
    render(
      <FileDropZone
        label="Drop files here"
        hint="Accepts BAM files"
        onFiles={vi.fn()}
      />
    )
    expect(screen.getByText('Drop files here')).toBeInTheDocument()
    expect(screen.getByText('Accepts BAM files')).toBeInTheDocument()
  })

  it('has correct aria-label', () => {
    render(
      <FileDropZone label="Upload BAM" onFiles={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: 'Upload BAM' })).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <FileDropZone label="Upload" onFiles={vi.fn()} disabled />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('responds to drag over', () => {
    const { container } = render(
      <FileDropZone label="Upload" onFiles={vi.fn()} />
    )
    const dropzone = container.firstChild as HTMLElement
    fireEvent.dragOver(dropzone, { dataTransfer: { files: [] } })
    // Should not throw
    expect(dropzone).toBeInTheDocument()
  })

  it('calls onFiles when file is dropped', () => {
    const onFiles = vi.fn()
    const { container } = render(
      <FileDropZone label="Upload" onFiles={onFiles} />
    )
    const dropzone = container.firstChild as HTMLElement
    const file = new File(['content'], 'test.bam', { type: 'application/octet-stream' })
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    })
    expect(onFiles).toHaveBeenCalledWith([file])
  })

  it('does not call onFiles when disabled', () => {
    const onFiles = vi.fn()
    const { container } = render(
      <FileDropZone label="Upload" onFiles={onFiles} disabled />
    )
    const dropzone = container.firstChild as HTMLElement
    const file = new File(['content'], 'test.bam')
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    })
    expect(onFiles).not.toHaveBeenCalled()
  })
})
