//! add-dist-header v1.6.6 ~~ https://github.com/center-key/add-dist-header ~~ MIT License

import { cliArgvUtil } from 'cli-argv-util';
import { globSync } from 'glob';
import { isBinary } from 'istextorbinary';
import chalk from 'chalk';
import fs from 'node:fs';
import log from 'fancy-log';
import os from 'node:os';
import path from 'node:path';
import slash from 'slash';
const name = chalk.gray('add-dist-header');
const addDistHeader = {
    version: '1.6.6',
    assertOk(ok, message) {
        if (!ok)
            throw new Error(`[add-dist-header] ${message}`);
    },
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
        addDistHeader.assertOk(filename, 'Must specify the "filename" option.');
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
        const comment = firstLine[type];
        const doctypePattern = /^<(!doctype|\?xml).*/i;
        const versionPattern = /{{package\.version}}/g;
        const isTextFile = !isBinary(filename);
        const input = fs.readFileSync(filename, 'utf-8').trim();
        const out1 = settings.replaceComment ? input.replace(comment, '').trim() : input;
        const out2 = mlStyle ? out1.replace(doctypePattern, '').trim() : out1;
        const out3 = settings.setVersion ? out2.replace(versionPattern, pkg.version) : out2;
        const doctypeLine = out1.match(doctypePattern)?.[0];
        const doctype = mlStyle && doctypeLine ? doctypeLine + os.EOL : '';
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
        const isMinified = outputPath.includes('.min.') || (numLines < 5 && fileExt !== '.ts');
        const spacerLines = os.EOL.repeat(isMinified || mlStyle ? 1 : 2);
        const platformEol = (text) => text.replace(/\r?\n/g, os.EOL);
        const final = platformEol(doctype + header + spacerLines + out3 + os.EOL);
        if (isTextFile)
            fs.writeFileSync(outputPath, final);
        else if (settings.allFiles)
            fs.copyFileSync(filename, outputPath);
        const bytes = isTextFile ? final.replaceAll('\r', '').length : null;
        const result = {
            valid: isTextFile || settings.allFiles,
            text: isTextFile,
            dist: distFolder,
            header: isTextFile ? header : null,
            source: slash(filename),
            file: outputPath,
            length: bytes,
            size: isTextFile ? (bytes / 1024).toLocaleString([], fixedDigits) + ' KB' : null,
        };
        return result;
    },
    reporter(result, options, count) {
        const defaults = {
            quiet: false,
        };
        const settings = { ...defaults, ...options };
        const fileCount = count ? chalk.magenta(count) + ' ' : '';
        const size = chalk.blue('(' + (result.size || 'binary') + ')');
        if (!settings.quiet && result.valid)
            log(name, fileCount + cliArgvUtil.colorizePath(result.file), size);
        return result;
    },
    cli() {
        const validFlags = ['all-files', 'delimiter', 'ext', 'keep', 'keep-first', 'new-ext',
            'no-version', 'note', 'quiet', 'recursive'];
        const cli = cliArgvUtil.parse(validFlags);
        const source = cli.params[0] ?? 'build/*';
        const target = cli.params[1] ?? 'dist';
        const isFolder = (name) => name.endsWith(path.sep);
        const cleanPath = (name) => path.normalize(isFolder(name) ? name.slice(0, -1) : name);
        const origin = cleanPath(source);
        const targetRoot = cleanPath(target);
        const realFolder = fs.existsSync(origin) && fs.statSync(origin).isDirectory();
        const wildcard = cli.flagOn.recursive ? '/**/*' : '/*';
        const pattern = slash(realFolder ? origin + wildcard : origin);
        const extensions = cli.flagMap.ext?.split(',') ?? null;
        const keep = (file) => !extensions || extensions.includes(path.extname(file));
        const filenames = globSync(pattern, { nodir: true }).map(slash).filter(keep).sort();
        const error = cli.invalidFlag ? cli.invalidFlagMsg :
            cli.paramCount > 2 ? 'Extraneous parameter: ' + cli.params[2] :
                !filenames.length ? 'File not found: ' + source :
                    source.includes('*') ? 'Wildcards not supported in source: ' + source :
                        null;
        addDistHeader.assertOk(!error, error);
        const version = chalk.gray('v' + addDistHeader.version);
        const summary = chalk.white(`(files: ${filenames.length})`);
        if (!cli.flagOn.quiet)
            log(name, version, origin, summary);
        const calcOptions = (sourceFilename) => ({
            allFiles: cli.flagOn.allFiles,
            delimiter: cli.flagMap.delimiter ?? '~~',
            dist: targetRoot + path.dirname(sourceFilename).substring(origin.length),
            extension: cli.flagMap.newExt ?? null,
            replaceComment: !cli.flagOn.keep,
            setVersion: !cli.flagOn.noVersion,
        });
        const getResult = (filename) => addDistHeader.prepend(filename, calcOptions(filename));
        const reporterSettings = { quiet: cli.flagOn.quiet };
        filenames.forEach((filename, index) => addDistHeader.reporter(getResult(filename), reporterSettings, index + 1));
    },
};
export { addDistHeader };
