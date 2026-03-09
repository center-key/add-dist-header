// Add Distribution Header
// CLI Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from 'cli-argv-util';
import fs from 'fs';

// Setup
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

////////////////////////////////////////////////////////////////////////////////
describe('Executing the CLI', () => {
   const run = (posix) => cliArgvUtil.run(pkg, posix);

   it('with the --all-files flag and --recursive flag handles all files including subfolders', () => {
      run('add-dist-header spec/fixtures spec/target/cli/all --all-files --recursive');
      const actual = cliArgvUtil.readFolder('spec/target/cli/all');
      const expected = [
         'kebab.css',
         'kebab.html',
         'kebab.jpg',
         'kebab.js',
         'kebab.min.js',
         'kebab.ts',
         'kebab.xml',
         'subfolder',
         'subfolder/pita-bread.js',
         'subfolder/pita-bread.png',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   it('with the --ext flag adds a header only to files with a specified file extension', () => {
      run('add-dist-header spec/fixtures spec/target/cli/ext --ext=.css,.js');
      const actual = fs.readdirSync('spec/target/cli/ext').sort();
      const expected = [
         'kebab.css',
         'kebab.js',
         'kebab.min.js',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   it('with the --new-ext flag renames the target to use the specificed file extention', () => {
      run('add-dist-header spec/fixtures spec/target/cli/new-ext --ext=.css --new-ext=.style.css');
      const actual =   fs.readFileSync('spec/target/cli/new-ext/kebab.style.css', 'utf-8');
      const expected = fs.readFileSync('spec/target/cli/ext/kebab.css', 'utf-8');
      assertDeepStrictEqual(actual, expected);
      });

   });
