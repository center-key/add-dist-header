//! add-dist-header v1.4.0 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

import { isBinary } from 'istextorbinary';
import chalk from 'chalk';
import fs from 'fs';
import log from 'fancy-log';
import makeDir from 'make-dir';
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
        const fileExt = settings.extension ?? inputFile.ext;
        const jsStyle = /\.(js|ts|cjs|mjs)$/.test(fileExt);
        const mlStyle = /\.(html|htm|sgml|xml|php)$/.test(fileExt);
        const type = jsStyle ? 'js' : mlStyle ? 'ml' : 'other';
        const isTextFile = !isBinary(filename);
        const input = fs.readFileSync(filename, 'utf-8').trimStart();
        const normalizeEol = /\r/g;
        const normalizeEof = /\s*$(?!\n)/;
        const out1 = input.replace(normalizeEol, '').replace(normalizeEof, '\n');
        const out2 = settings.replaceComment ? out1.replace(firstLine[type], '') : out1;
        const doctype = mlStyle && out2.match(doctypeLine)?.[0] || '';
        const out3 = mlStyle && doctype ? out2.replace(doctype, '') : out2;
        const versionPattern = /{{pkg[.]version}}/g;
        const out4 = settings.setVersion ? out3.replace(versionPattern, pkg.version) : out3;
        const info = pkg.homepage ?? pkg.docs ?? pkg.repository;
        const unlicensed = !pkg.license || pkg.license === 'UNLICENSED';
        const license = unlicensed ? 'All Rights Reserved' : pkg.license + ' License';
        const delimiter = ' ' + settings.delimiter + ' ';
        const banner = [`${pkg.name} v${pkg.version}`, info, license].join(delimiter);
        const header = commentStyle[type].start + banner + commentStyle[type].end;
        const fixedDigits = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        const distFolder = makeDir.sync(settings.dist);
        const formatOptions = { dir: settings.dist, name: inputFile.name, ext: fileExt };
        const outputPath = slash(path.format(formatOptions));
        const isMinified = outputPath.includes('.min.') || out4.indexOf('\n') === out4.length - 1;
        const spacerLines = isMinified || mlStyle ? '\n' : '\n\n';
        const leadingBlanks = /^\s*\n/;
        const final = doctype + header + spacerLines + out4.replace(leadingBlanks, '');
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
