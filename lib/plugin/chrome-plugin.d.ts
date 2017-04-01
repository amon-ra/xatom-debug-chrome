export declare class ChromePlugin {
    private pluginClient;
    private launcher;
    private debugger;
    options: Object;
    name: String;
    iconPath: String;
    constructor();
    register(client: any): void;
    didRun(): Promise<void>;
    didStop(): Promise<void>;
    didResume(): Promise<void>;
    didPause(): Promise<void>;
    didAddBreakpoint(filePath: any, lineNumber: any): Promise<void>;
    didRemoveBreakpoint(filePath: any, lineNumber: any): Promise<void>;
    didStepOver(): Promise<void>;
    didStepInto(): Promise<void>;
    didStepOut(): Promise<void>;
    didRequestProperties(request: any, propertyView: any): Promise<void>;
    didEvaluateExpression(expression: string, evaluationView: any): Promise<void>;
}
