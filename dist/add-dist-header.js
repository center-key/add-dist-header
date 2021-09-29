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
        const inputFile = parse(settings.filename);
        const outputFileExt = settings.extension ?? inputFile.ext;
        const jsStyle = /\.(js|ts|cjs|mjs)/.test(outputFileExt);
        const input = readFileSync(settings.filename, 'utf8');
        const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
        const versionPattern = /{{{version}}}/g;
        const dist = settings.setVersion ? input.replace(versionPattern, pkg.version) : input;
        const banner = `${pkg.name} v${pkg.version} ~ ${pkg.repository} ~ ${pkg.license} License`;
        const header = (jsStyle ? '//! ' : '/*! ') + banner + (jsStyle ? '' : ' */');
        const output = header + '\n\n' + dist;
        const distFolder = makeDir.sync(settings.dist);
        const outputFilename = format({
            dir: settings.dist,
            name: inputFile.name,
            ext: outputFileExt,
        });
        writeFileSync(outputFilename, output);
        return { dist: distFolder, header: header, file: outputFilename, length: output.length };
    },
};
export { addDistHeader };