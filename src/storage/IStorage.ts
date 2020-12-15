
export interface IStorage {
    setContent(content: string, callback: (e?: any) => void): void
    getContent(callback: (e: any, content?: string) => void): void
}
