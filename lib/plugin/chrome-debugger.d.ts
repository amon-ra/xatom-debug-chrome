export declare class ChromeDebugger {
    private protocol;
    connect(socketUrl: string): Promise<void>;
    getPages(): void;
}
