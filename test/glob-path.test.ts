import { assertEquals } from 'https://deno.land/std@0.182.0/testing/asserts.ts';
import { esbuild } from '../deps.ts';
import copyPlugin from '../mod.ts';

Deno.test('Copy files glob #1', async () => {
  await Deno.remove('test/dest', { recursive: true });
  try {
    const ctx = await esbuild.context({
      plugins: [
        copyPlugin({
          baseDir: 'test/src',
          baseOutDir: 'test/dest',
          files: [
            { from: '*.html', to: '[path]/[name][ext]' },
          ],
        }),
      ],
    });
    await ctx.rebuild();
  } finally {
    esbuild.stop();
  }

  assertEquals(
    Deno.readTextFileSync('test/dest/page1.html'),
    'page1\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/page2.html'),
    'page2\n',
  );
});

Deno.test('Copy files glob #2', async () => {
  await Deno.remove('test/dest', { recursive: true });
  try {
    const ctx = await esbuild.context({
      plugins: [
        copyPlugin({
          baseDir: 'test/src',
          baseOutDir: 'test/dest',
          files: [
            { from: '*.txt', to: '[path]/[name][ext]' },
          ],
        }),
      ],
    });
    await ctx.rebuild();
  } finally {
    esbuild.stop();
  }

  assertEquals(
    Deno.readTextFileSync('test/dest/resource1.txt'),
    'resource1\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/resource2.txt'),
    'resource2\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/resource3.txt'),
    'resource3\n',
  );
});

Deno.test('Copy files glob #3', async () => {
  await Deno.remove('test/dest', { recursive: true });
  try {
    const ctx = await esbuild.context({
      plugins: [
        copyPlugin({
          baseDir: 'test/src',
          baseOutDir: 'test/dest',
          files: [
            { from: '**/*.txt', to: '[path]/[name][ext]' },
          ],
        }),
      ],
    });
    await ctx.rebuild();
  } finally {
    esbuild.stop();
  }

  assertEquals(
    Deno.readTextFileSync('test/dest/resource1.txt'),
    'resource1\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/resource2.txt'),
    'resource2\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/resource3.txt'),
    'resource3\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/some/resource4.txt'),
    'resource4\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/some/resource5.txt'),
    'resource5\n',
  );
});

Deno.test('Copy files glob #4', async () => {
  await Deno.remove('test/dest', { recursive: true });
  try {
    const ctx = await esbuild.context({
      plugins: [
        copyPlugin({
          baseDir: 'test/src',
          baseOutDir: 'test/dest',
          files: [
            { from: '**/*.txt', to: 'res/[name][ext]' },
          ],
        }),
      ],
    });
    await ctx.rebuild();
  } finally {
    esbuild.stop();
  }

  assertEquals(
    Deno.readTextFileSync('test/dest/res/resource1.txt'),
    'resource1\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/res/resource2.txt'),
    'resource2\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/res/resource3.txt'),
    'resource3\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/res/resource4.txt'),
    'resource4\n',
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/res/resource5.txt'),
    'resource5\n',
  );
});
