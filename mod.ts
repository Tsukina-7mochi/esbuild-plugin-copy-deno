import { esbuild } from './deps.ts';
import { posix } from './deps.ts';
import { fs } from './deps.ts';

interface Option {
  baseDir?: string;
  baseOutDir?: string;
  files: {
    from: string;
    to: string;
  }[];
  runAt?: 'onStart' | 'onEnd';
  outputLog?: boolean;
}

/**
 * A plugin that copies files specified by `option`. Example:
 * ```
 * copyPlugin({
 *   // base directory of source files
 *   baseDir: './src',
 *   // base directory of destination files
 *   baseOutDir: './dist',
 *   // files should be copied
 *   files: [
 *     { from: 'imgs/*', to: 'imgs/[name][ext]' },
 *     { from: 'wasm/*', to: 'wasm/[name][ext]' },
 *   ]
 * })
 * ```
 */
const copyPlugin = (option: Option): esbuild.Plugin => {
  const baseDir = option.baseDir ?? Deno.cwd();
  const baseOutDir = option.baseOutDir ?? Deno.cwd();
  const runAt = option?.runAt ?? 'onStart';

  return {
    name: 'copy-plugin',
    setup(build) {
      build[runAt](async () => {
        // directories that must be ensured to exist
        const ensureDirNames: Set<string> = new Set();
        const copyFromTo: { src: string; dest: string }[] = [];

        for (const file of option.files) {
          const fromFileGlob = posix.isAbsolute(file.from)
            ? file.from
            : posix.join(baseDir, file.from);

          for await (const fromFile of fs.expandGlob(fromFileGlob)) {
            if (!fromFile.isFile) {
              continue;
            }

            // relative directory name from `baseDir`
            const dirname = posix.dirname(
              posix.relative(baseDir, fromFile.path),
            );
            const ext = posix.extname(fromFile.name);
            const name = posix.basename(
              ext.length === 0
                ? fromFile.name
                : fromFile.name.slice(0, -ext.length),
            );
            const toFile = posix.resolve(
              baseOutDir,
              file.to
                .replace('[path]', dirname)
                .replace('[name]', name)
                .replace('[ext]', ext),
            );

            ensureDirNames.add(posix.dirname(toFile));
            copyFromTo.push({
              src: fromFile.path,
              dest: toFile,
            });
          }
        }

        // ensure all output directory
        await Promise.all(
          Array.from(ensureDirNames).map((dirname) => fs.ensureDir(dirname)),
        );

        // copy files
        if (option.outputLog) {
          copyFromTo.forEach(({ src, dest }) => {
            console.log(`copy: ${src} -> ${dest}`);
          });
        }
        await Promise.all(copyFromTo.map(({ src, dest }) =>
          fs.copy(
            src,
            dest,
            { overwrite: true },
          )
        ));
      });
    },
  };
};

export default copyPlugin;
