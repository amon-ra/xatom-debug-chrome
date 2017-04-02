export declare class ChromeDebugger {
    private protocol;
    connect(socketUrl: string): Promise<void>;
    disconnect(): Promise<void>;
    getPages(): void;
}
