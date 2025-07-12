//! add-dist-header v1.5.0 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

import { EOL } from 'node:os';
import { isBinary } from 'istextorbinary';
import chalk from 'chalk';
import fs from 'fs';
import log from 'fancy-log';
import path from 'path';
import slash from 'slash';
const addDistHeader = {
    prepend(filename, options) {
        const defaults = {
            allFiles: false,
            dist: 'dist',
            extension: null,
            delimiter: '~~',
            replaceComment: true,
            setVersion: true,
        };
        const settings = { ...defaults, ...options };
        if (!filename)
            throw new Error('[add-dist-header] Must specify the "filename" option.');
        const commentStyle = {
            js: { start: '//! ', end: '' },
            ml: { start: '<!-- ', end: ' -->' },
            other: { start: '/*! ', end: ' */' },
        };
        const firstLine = {
            js: /^(\/\/[^!].*|\/[*][^!].*[*]\/)/,
            ml: /^<!--.*-->/,
            other: /^\/[*][^!].*[*]\//,
        };
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        const inputFile = path.parse(filename);
        const fileExt = settings.extension ?? inputFile.ext;
        const jsStyle = /\.(js|ts|cjs|mjs|less)$/.test(fileExt);
        const mlStyle = /\.(html|htm|sgml|xml|php)$/.test(fileExt);
        const type = jsStyle ? 'js' : mlStyle ? 'ml' : 'other';
        const doctypePattern = /^<(!doctype|\?xml).*/i;
        const versionPattern = /{{package\.version}}/g;
        const isTextFile = !isBinary(filename);
        const input = fs.readFileSync(filename, 'utf-8').trim();
        const out1 = settings.replaceComment ? input.replace(firstLine[type], '').trim() : input;
        const out2 = mlStyle ? out1.replace(doctypePattern, '').trim() : out1;
        const out3 = settings.setVersion ? out2.replace(versionPattern, pkg.version) : out2;
        const doctypeLine = out1.match(doctypePattern)?.[0];
        const doctype = mlStyle && doctypeLine ? doctypeLine + EOL : '';
        const info = pkg.homepage ?? pkg.docs ?? pkg.repository;
        const unlicensed = !pkg.license || pkg.license === 'UNLICENSED';
        const license = unlicensed ? 'All Rights Reserved' : `${pkg.license} License`;
        const delimiter = ' ' + settings.delimiter + ' ';
        const banner = [`${pkg.name} v${pkg.version}`, info, license].join(delimiter);
        const header = commentStyle[type].start + banner + commentStyle[type].end;
        const fixedDigits = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        const distFolder = fs.mkdirSync(settings.dist, { recursive: true }) ?? settings.dist;
        const formatOptions = { dir: settings.dist, name: inputFile.name, ext: fileExt };
        const outputPath = slash(path.format(formatOptions));
        const numLines = input.match(/^/gm).length;
        const isMinified = outputPath.includes('.min.') || numLines < 5;
        const spacerLines = EOL.repeat(isMinified || mlStyle ? 1 : 2);
        const final = doctype + header + spacerLines + out3 + EOL;
        if (isTextFile)
            fs.writeFileSync(outputPath, final);
        else if (settings.allFiles)
            fs.copyFileSync(filename, outputPath);
        return {
            valid: isTextFile || settings.allFiles,
            text: isTextFile,
            dist: distFolder,
            header: isTextFile ? header : null,
            source: slash(filename),
            file: outputPath,
            length: isTextFile ? final.length : null,
            size: isTextFile ? (final.length / 1024).toLocaleString([], fixedDigits) + ' KB' : null,
        };
    },
    reporter(result, options) {
        const defaults = {
            quiet: false,
        };
        const settings = { ...defaults, ...options };
        const name = chalk.gray('add-dist-header');
        const arrow = chalk.gray.bold('→');
        const source = chalk.blue.bold(result.source);
        const target = chalk.magenta(result.file);
        const size = chalk.white('(' + (result.size || 'binary') + ')');
        if (!settings.quiet && result.valid)
            log(name, source, arrow, target, size);
        return result;
    },
};
export { addDistHeader };
