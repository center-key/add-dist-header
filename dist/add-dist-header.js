//! add-dist-header v0.3.3 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

import { isBinary } from 'istextorbinary';
import path from 'path';
import fs from 'fs';
import makeDir from 'make-dir';
import slash from 'slash';
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
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        const inputFile = path.parse(filename);
        const fileExt = (_a = settings.extension) !== null && _a !== void 0 ? _a : inputFile.ext;
        const jsStyle = /\.(js|ts|cjs|mjs)$/.test(fileExt);
        const mlStyle = /\.(html|htm|sgml|xml|php)$/.test(fileExt);
        const type = jsStyle ? 'js' : mlStyle ? 'ml' : 'other';
        const invalidContent = isBinary(filename);
        const input = fs.readFileSync(filename, 'utf-8');
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
        const spacerLines = (path) => path.includes('.min.') || mlStyle ? '\n' : '\n\n';
        const distFolder = makeDir.sync(settings.dist);
        const outputPath = slash(path.format({ dir: settings.dist, name: inputFile.name, ext: fileExt }));
        const leadingBlanks = /^\s*\n/;
        const final = header + spacerLines(outputPath) + out3.replace(leadingBlanks, '');
        if (!invalidContent)
            fs.writeFileSync(outputPath, final);
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
export { addDistHeader };
