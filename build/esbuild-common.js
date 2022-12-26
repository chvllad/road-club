import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const runEsbuild = ({ minify = false, watch = false } = {}) => {
  esbuild
    .build({
      logLevel: 'debug',
      metafile: true,
      entryPoints: {
        index: 'scss/index.scss',
        script: 'scripts/script.js',
      },
      loader: {
        '.woff': 'file',
        '.woff2': 'file',
        '.svg': 'file',
        '.jpg': 'file',
      },
      outdir: 'dist',
      bundle: true,
      minify,
      watch,
      plugins: [
        sassPlugin({
          async transform(source) {
            const { css } = await postcss([autoprefixer]).process(source);
            return css;
          },
        }),
      ],
    })
    .then(() => console.log('⚡ Build complete! ⚡'))
    .catch(() => process.exit(1));
};

export default runEsbuild;
