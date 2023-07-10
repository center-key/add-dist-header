//! add-dist-header v1.1.2 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

import { isBinary } from 'istextorbinary';
import path from 'path';
import fs from 'fs';
import makeDir from 'make-dir';
import slash from 'slash';
const addDistHeader = {
    prepend(filename, options) {
        var _a, _b, _c, _d;
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
        const doctypeLine = /^<(!doctype|\?xml).*\n/i;
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
        const doctype = mlStyle && ((_b = out2.match(doctypeLine)) === null || _b === void 0 ? void 0 : _b[0]) || '';
        const out3 = mlStyle && doctype ? out2.replace(doctype, '') : out2;
        const versionPattern = /{{pkg[.]version}}/g;
        const out4 = settings.setVersion ? out3.replace(versionPattern, pkg.version) : out3;
        const info = (_d = (_c = pkg.homepage) !== null && _c !== void 0 ? _c : pkg.docs) !== null && _d !== void 0 ? _d : pkg.repository;
        const unlicensed = !pkg.license || pkg.license === 'UNLICENSED';
        const license = unlicensed ? 'All Rights Reserved' : pkg.license + ' License';
        const delimiter = ' ' + settings.delimiter + ' ';
        const banner = [`${pkg.name} v${pkg.version}`, info, license].join(delimiter);
        const header = commentStyle[type].start + banner + commentStyle[type].end;
        const fixedDigits = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        const distFolder = makeDir.sync(settings.dist);
        const outputPath = slash(path.format({ dir: settings.dist, name: inputFile.name, ext: fileExt }));
        const isMinified = outputPath.includes('.min.') || out4.indexOf('\n') === out4.length - 1;
        const spacerLines = isMinified || mlStyle ? '\n' : '\n\n';
        const leadingBlanks = /^\s*\n/;
        const final = doctype + header + spacerLines + out4.replace(leadingBlanks, '');
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
