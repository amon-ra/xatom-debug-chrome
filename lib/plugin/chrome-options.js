"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryType = {
    Automatic: 'Auto',
    Custom: 'Custom'
};
exports.trimPathChars = ['/', '\\', ' '];
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
    portNumber: {
        type: 'number',
        title: 'Port Number',
        default: 9222,
        description: 'Port to use to run the debugger'
    },
    serverUrl: {
        type: 'string',
        title: 'Web Address',
        default: 'http://localhost:8080'
    },
    basePath: {
        type: 'string',
        title: 'Base Path',
        default: 'dist/',
        description: 'Relative project path files location for the provided server. ex: dist/'
    },
    mappingPaths: {
        type: 'object',
        title: 'Path Mappings',
        default: {},
        description: 'Source map path overrides, useful for advanced bundle tools like webpack.'
    }
};
//# sourceMappingURL=chrome-options.js.map