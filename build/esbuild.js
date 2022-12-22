import { emptyDirSync } from 'fs-extra';
import runEsbuild from './esbuild-common.js';

emptyDirSync('dist');

runEsbuild({ minify: true });
