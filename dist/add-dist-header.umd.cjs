var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "fs", "make-dir"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addDistHeader = void 0;
    const path_1 = require("path");
    const fs_1 = require("fs");
    const make_dir_1 = __importDefault(require("make-dir"));
    const addDistHeader = {
        prepend(options) {
            const defaults = {
                dist: 'dist',
                setVersion: true,
            };
            const settings = { ...defaults, ...options };
            if (!settings.filename)
                throw Error('Must specify the "filename" option.');
            const inputFile = (0, path_1.parse)(settings.filename);
            const outputFileExt = settings.extension ?? inputFile.ext;
            const jsStyle = /\.(js|ts|cjs|mjs)/.test(outputFileExt);
            const input = (0, fs_1.readFileSync)(settings.filename, 'utf8');
            const pkg = JSON.parse((0, fs_1.readFileSync)('package.json', 'utf8'));
            const versionPattern = /{{{version}}}/g;
            const dist = settings.setVersion ? input.replace(versionPattern, pkg.version) : input;
            const banner = `${pkg.name} v${pkg.version} ~ ${pkg.repository} ~ ${pkg.license} License`;
            const header = (jsStyle ? '//! ' : '/*! ') + banner + (jsStyle ? '' : ' */');
            const output = header + '\n\n' + dist;
            const distFolder = make_dir_1.default.sync(settings.dist);
            const outputFilename = (0, path_1.format)({
                dir: settings.dist,
                name: inputFile.name,
                ext: outputFileExt,
            });
            (0, fs_1.writeFileSync)(outputFilename, output);
            return { dist: distFolder, header: header, file: outputFilename, length: output.length };
        },
    };
    exports.addDistHeader = addDistHeader;
});
