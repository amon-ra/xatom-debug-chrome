import { ChromeDebuggingProtocolPlugin } from 'atom-bugs-chrome-debugger/lib/plugin';
import { ChromeLauncher } from './chrome-launcher';
import { ChromeDebugger } from './chrome-debugger';
export declare class ChromePlugin extends ChromeDebuggingProtocolPlugin {
    options: Object;
    name: String;
    iconPath: String;
    launcher: ChromeLauncher;
    debugger: ChromeDebugger;
    constructor();
    didRun(): Promise<void>;
}
