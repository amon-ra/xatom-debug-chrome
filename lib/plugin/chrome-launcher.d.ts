import { ChromeDebuggingProtocolLauncher } from 'atom-bugs-chrome-debugger/lib/launcher';
export interface Page {
    type: string;
    url: string;
    webSocketDebuggerUrl?: string;
}
export declare type Pages = Array<Page>;
export declare class ChromeLauncher extends ChromeDebuggingProtocolLauncher {
    hostName: string;
    portNumber: number;
    customBinaryPath: string;
    constructor();
    getLauncherArguments(): string[];
    getBinaryPath(): string;
}
