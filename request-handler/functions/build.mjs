import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['request-handler/functions/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'node',
  target: 'es2020',
  outfile: 'request-handler/functions/dist/index.js',
  external: ['@aws-sdk/*']
});
