//! add-dist-header v0.3.4 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "istextorbinary", "path", "fs", "make-dir", "slash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addDistHeader = void 0;
    const istextorbinary_1 = require("istextorbinary");
    const path_1 = __importDefault(require("path"));
    const fs_1 = __importDefault(require("fs"));
    const make_dir_1 = __importDefault(require("make-dir"));
    const slash_1 = __importDefault(require("slash"));
    const addDistHeader = {
        prepend(filename, options) {
            var _a, _b, _c;
            const defaults = {
                dist: 'dist',
                extension: null,
                delimiter: '~~',
                replaceComment: true,
                setVersion: true,
            };
            const settings = Object.assign(Object.assign({}, defaults), options);
            if (!filename)
                throw Error('[add-dist-header] Must specify the "filename" option.');
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
            const pkg = JSON.parse(fs_1.default.readFileSync('package.json', 'utf-8'));
            const inputFile = path_1.default.parse(filename);
            const fileExt = (_a = settings.extension) !== null && _a !== void 0 ? _a : inputFile.ext;
            const jsStyle = /\.(js|ts|cjs|mjs)$/.test(fileExt);
            const mlStyle = /\.(html|htm|sgml|xml|php)$/.test(fileExt);
            const type = jsStyle ? 'js' : mlStyle ? 'ml' : 'other';
            const invalidContent = (0, istextorbinary_1.isBinary)(filename);
            const input = fs_1.default.readFileSync(filename, 'utf-8');
            const normalizeEol = /\r/g;
            const normalizeEof = /\s*$(?!\n)/;
            const out1 = input.replace(normalizeEol, '').replace(normalizeEof, '\n');
            const out2 = settings.replaceComment ? out1.replace(firstLine[type], '') : out1;
            const versionPattern = /~~~version~~~/g;
            const out3 = settings.setVersion ? out2.replace(versionPattern, pkg.version) : out2;
            const info = (_c = (_b = pkg.homepage) !== null && _b !== void 0 ? _b : pkg.docs) !== null && _c !== void 0 ? _c : pkg.repository;
            const unlicensed = !pkg.license || pkg.license === 'UNLICENSED';
            const license = unlicensed ? 'All Rights Reserved' : pkg.license + ' License';
            const delimiter = ' ' + settings.delimiter + ' ';
            const banner = [`${pkg.name} v${pkg.version}`, info, license].join(delimiter);
            const header = commentStyle[type].start + banner + commentStyle[type].end;
            const fixedDigits = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
            const distFolder = make_dir_1.default.sync(settings.dist);
            const outputPath = (0, slash_1.default)(path_1.default.format({ dir: settings.dist, name: inputFile.name, ext: fileExt }));
            const isMinified = outputPath.includes('.min.') || out3.indexOf('\n') === out3.length - 1;
            const spacerLines = isMinified || mlStyle ? '\n' : '\n\n';
            const leadingBlanks = /^\s*\n/;
            const final = header + spacerLines + out3.replace(leadingBlanks, '');
            if (!invalidContent)
                fs_1.default.writeFileSync(outputPath, final);
            return {
                valid: !invalidContent,
                dist: distFolder,
                header: header,
                source: filename,
                file: outputPath,
                length: final.length,
                size: (final.length / 1024).toLocaleString([], fixedDigits) + ' KB',
            };
        },
    };
    exports.addDistHeader = addDistHeader;
});
