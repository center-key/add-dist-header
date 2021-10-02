//! add-dist-header v0.1.2 ~ https://github.com/center-key/add-dist-header ~ MIT License

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
                delimiter: '~',
                replaceComment: true,
                setVersion: true,
            };
            const settings = { ...defaults, ...options };
            if (!settings.filename)
                throw Error('Must specify the "filename" option.');
            const commentStyle = {
                js: { start: '//! ', end: '' },
                ml: { start: '<!-- ', end: ' -->' },
                other: { start: '/*! ', end: ' */' },
            };
            const firstLine = {
                js: /^(\/\/[^!].*|\/[*][^!].*[*]\/)\n/,
                ml: /^<!--.*-->\n/,
                other: /^\/[*][^!].*[*]\/\n/,
            };
            const pkg = JSON.parse((0, fs_1.readFileSync)('package.json', 'utf8'));
            const inputFile = (0, path_1.parse)(settings.filename);
            const fileExt = settings.extension ?? inputFile.ext;
            const jsStyle = /\.(js|ts|cjs|mjs)$/.test(fileExt);
            const mlStyle = /\.(html|sgml|xml|php)$/.test(fileExt);
            const type = jsStyle ? 'js' : mlStyle ? 'ml' : 'other';
            const input = (0, fs_1.readFileSync)(settings.filename, 'utf8');
            const out1 = settings.replaceComment ? input.replace(firstLine[type], '') : input;
            const versionPattern = /~~~version~~~/g;
            const out2 = settings.setVersion ? out1.replace(versionPattern, pkg.version) : out1;
            const info = pkg.homepage ?? pkg.docs ?? pkg.repository;
            const unlicensed = !pkg.license || pkg.license === 'UNLICENSED';
            const license = unlicensed ? 'All Rights Reserved' : pkg.license + ' License';
            const delimiter = ' ' + settings.delimiter + ' ';
            const banner = [`${pkg.name} v${pkg.version}`, info, license].join(delimiter);
            const header = commentStyle[type].start + banner + commentStyle[type].end;
            const fixedDigits = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
            const spacerLines = (path) => path.includes('.min.') || mlStyle ? '\n' : '\n\n';
            const distFolder = make_dir_1.default.sync(settings.dist);
            const outputPath = (0, path_1.format)({ dir: settings.dist, name: inputFile.name, ext: fileExt });
            const out3 = header + spacerLines(outputPath) + out2.replace(/^\s*\n/, '');
            (0, fs_1.writeFileSync)(outputPath, out3);
            return {
                dist: distFolder,
                header: header,
                file: outputPath,
                length: out3.length,
                size: (out3.length / 1024).toLocaleString([], fixedDigits) + ' kB',
            };
        },
    };
    exports.addDistHeader = addDistHeader;
});
