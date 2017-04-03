import { ChromeDebuggingProtocolDebugger } from 'atom-bugs-chrome-debugger/lib/debugger';
export declare class ChromeDebugger extends ChromeDebuggingProtocolDebugger {
    domains: any;
    constructor();
    getFeatures(): Array<Promise<any>>;
}
