//! add-dist-header v0.1.4 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

import { format, parse } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import makeDir from 'make-dir';
const addDistHeader = {
    prepend(options) {
        const defaults = {
            dist: 'dist',
            delimiter: '~~',
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
        const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
        const inputFile = parse(settings.filename);
        const fileExt = settings.extension ?? inputFile.ext;
        const jsStyle = /\.(js|ts|cjs|mjs)$/.test(fileExt);
        const mlStyle = /\.(html|sgml|xml|php)$/.test(fileExt);
        const type = jsStyle ? 'js' : mlStyle ? 'ml' : 'other';
        const input = readFileSync(settings.filename, 'utf8');
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
        const distFolder = makeDir.sync(settings.dist);
        const outputPath = format({ dir: settings.dist, name: inputFile.name, ext: fileExt });
        const out3 = header + spacerLines(outputPath) + out2.replace(/^\s*\n/, '');
        writeFileSync(outputPath, out3);
        return {
            dist: distFolder,
            header: header,
            file: outputPath,
            length: out3.length,
            size: (out3.length / 1024).toLocaleString([], fixedDigits) + ' kB',
        };
    },
};
export { addDistHeader };
