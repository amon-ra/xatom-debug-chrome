export declare const BinaryType: {
    Automatic: string;
    Custom: string;
};
export declare const ChromeOptions: {
    binaryPath: {
        type: string;
        title: string;
        default: string;
        enum: string[];
    };
    customPath: {
        type: string;
        title: string;
        default: string;
        visible: {
            binaryPath: {
                contains: string[];
            };
        };
    };
    serverUrl: {
        type: string;
        title: string;
        default: string;
    };
};
