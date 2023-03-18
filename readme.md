# esbuild copy plugin for Deno

## Overview

A plugin for esbuild on Deno that copies files.

## Example

```typescript
const config: Partial<esbuild.BuildOptions> = {
  entryPoints: [
    posix.join(srcPath, 'main.ts'),
  ],
  bundle: true,
  outdir: destPath,
  platform: 'browser',
  plugins: [
    copyPlugin({
        // base directory of source files
        baseDir: './src',
        // base directory of destination files
        baseOutDir: './dist',
        // files should be copied
        files: [
            { from: 'imgs/*', to: 'imgs/[name].[ext]' },
            { from: 'wasm/*', to: 'wasm/[name].[ext]' },
        ]
    })
  ]
}
```
