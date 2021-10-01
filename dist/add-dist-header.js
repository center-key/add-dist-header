//! add-dist-header v0.1.0 ~ https://github.com/center-key/add-dist-header ~ MIT License

import { format, parse } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import makeDir from 'make-dir';
const addDistHeader = {
    prepend(options) {
        const defaults = {
            dist: 'dist',
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
        const inputFile = parse(settings.filename);
        const outputFileExt = settings.extension ?? inputFile.ext;
        const jsStyle = /\.(js|ts|cjs|mjs)$/.test(outputFileExt);
        const mlStyle = /\.(html|sgml|xml|php)$/.test(outputFileExt);
        const comment = commentStyle[jsStyle ? 'js' : mlStyle ? 'ml' : 'other'];
        const input = readFileSync(settings.filename, 'utf8');
        const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
        const versionPattern = /~~~version~~~/g;
        const dist = settings.setVersion ? input.replace(versionPattern, pkg.version) : input;
        const info = pkg.homepage ?? pkg.docs ?? pkg.repository;
        const unlicensed = !pkg.license || pkg.license === 'UNLICENSED';
        const license = unlicensed ? 'All Rights Reserved' : pkg.license + ' License';
        const banner = `${pkg.name} v${pkg.version} ~ ${info} ~ ${license}`;
        const header = comment.start + banner + comment.end;
        const output = header + '\n\n' + dist;
        const fixedDigits = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        const distFolder = makeDir.sync(settings.dist);
        const outputFilename = format({
            dir: settings.dist,
            name: inputFile.name,
            ext: outputFileExt,
        });
        writeFileSync(outputFilename, output);
        return {
            dist: distFolder,
            header: header,
            file: outputFilename,
            length: output.length,
            size: (output.length / 1024).toLocaleString([], fixedDigits) + ' kB',
        };
    },
};
export { addDistHeader };
