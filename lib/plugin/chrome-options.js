"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryType = {
    Automatic: 'Auto',
    Custom: 'Custom'
};
exports.ChromeOptions = {
    binaryPath: {
        type: 'string',
        title: 'Chrome Binary',
        default: exports.BinaryType.Automatic,
        enum: [
            exports.BinaryType.Automatic,
            exports.BinaryType.Custom
        ]
    },
    customBinaryPath: {
        type: 'string',
        title: 'Custom Binary Path',
        default: '',
        visible: {
            binaryPath: {
                contains: [exports.BinaryType.Custom]
            }
        }
    },
    serverUrl: {
        type: 'string',
        title: 'Server Address',
        default: 'http://localhost:8080'
    },
    basePath: {
        type: 'string',
        title: 'Base Path',
        default: 'dist/',
        description: 'Relative project path files location for the provided server. ex: dist/'
    },
    portNumber: {
        type: 'number',
        title: 'Port Number',
        default: 9222,
        description: 'Port to use to run the debugger'
    }
};
//# sourceMappingURL=chrome-options.js.map