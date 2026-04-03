declare module '@biowasm/aioli' {
  interface AioliInstance {
    mount(files: File[]): Promise<string[]>
    exec(cmd: string): Promise<string>
    cat(path: string): Promise<string>
    fs: {
      writeFile(path: string, content: string): Promise<void>
    }
  }

  export default class Aioli {
    constructor(tools: string[])
    mount(files: File[]): Promise<string[]>
    exec(cmd: string): Promise<string>
    cat(path: string): Promise<string>
    fs: {
      writeFile(path: string, content: string): Promise<void>
    }
  }
}
