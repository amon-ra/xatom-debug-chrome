export interface Page {
    type: string;
    url: string;
    webSocketDebuggerUrl?: string;
}
export declare type Pages = Array<Page>;
export declare class ChromeLauncher {
    portNumber: number;
    hostName: string;
    private process;
    private maxAttempts;
    private attempt;
    private events;
    didStop(cb: any): void;
    didFail(cb: any): void;
    didReceiveOutput(cb: any): void;
    didReceiveError(cb: any): void;
    stop(): void;
    start(): Promise<string>;
    getBinaryPath(): string;
    getPages(): Promise<Pages>;
    findSocketUrl(): Promise<string>;
}
