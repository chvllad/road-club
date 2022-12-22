import liveServer from '@compodoc/live-server';
import { emptyDirSync } from 'fs-extra';
import runEsbuild from './esbuild-common.js';

emptyDirSync('dist');

// Turn on LiveServer on http://localhost:7000
liveServer.start({
  port: 7000,
  host: '0.0.0.0',
  root: '',
  open: true,
  ignore: 'node_modules',
  wait: 0,
});

runEsbuild({ watch: true });
