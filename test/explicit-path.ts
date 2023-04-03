import { assertEquals } from 'https://deno.land/std@0.182.0/testing/asserts.ts';
import { esbuild } from '../deps.ts';
import copyPlugin from '../mod.ts';

Deno.test('Copy file #1', async () => {
  await Deno.remove('test/dest', { recursive: true });
  try {
    const ctx = await esbuild.context({
      plugins: [
        copyPlugin({
          baseDir: 'test/src',
          baseOutDir: 'test/dest',
          files: [
            { from: 'page1.html', to: '[name][ext]' }
          ]
        })
      ]
    });
    await ctx.rebuild();
  } finally {
    esbuild.stop();
  }

  assertEquals(
    Deno.readTextFileSync('test/dest/page1.html'),
    'page1\n'
  );
});

Deno.test('Copy file #2', async () => {
  await Deno.remove('test/dest', { recursive: true });
  try {
    const ctx = await esbuild.context({
      plugins: [
        copyPlugin({
          baseDir: 'test/src',
          baseOutDir: 'test/dest',
          files: [
            { from: 'some/resource4.txt', to: 'res/[name][ext]' }
          ]
        })
      ]
    });
    await ctx.rebuild();
  } finally {
    esbuild.stop();
  }

  assertEquals(
    Deno.readTextFileSync('test/dest/res/resource4.txt'),
    'resource4\n'
  );
});

Deno.test('Copy file #3', async () => {
  await Deno.remove('test/dest', { recursive: true });
  try {
    const ctx = await esbuild.context({
      plugins: [
        copyPlugin({
          baseDir: 'test/src',
          baseOutDir: 'test/dest',
          files: [
            { from: 'page1.html', to: '[path]/[name][ext]' }
          ]
        })
      ]
    });
    await ctx.rebuild();
  } finally {
    esbuild.stop();
  }

  assertEquals(
    Deno.readTextFileSync('test/dest/page1.html'),
    'page1\n'
  );
});

Deno.test('Copy file #4', async () => {
  await Deno.remove('test/dest', { recursive: true });
  try {
    const ctx = await esbuild.context({
      plugins: [
        copyPlugin({
          baseDir: 'test/src',
          baseOutDir: 'test/dest',
          files: [
            { from: 'some/resource4.txt', to: '[path]/[name][ext]' }
          ]
        })
      ]
    });
    await ctx.rebuild();
  } finally {
    esbuild.stop();
  }

  assertEquals(
    Deno.readTextFileSync('test/dest/some/resource4.txt'),
    'resource4\n'
  );
});

Deno.test('Copy multi files #1', async () => {
  await Deno.remove('test/dest', { recursive: true });
  try {
    const ctx = await esbuild.context({
      plugins: [
        copyPlugin({
          baseDir: 'test/src',
          baseOutDir: 'test/dest',
          files: [
            { from: 'page1.html', to: 'index.html' },
            { from: 'page2.html', to: 'sub.html' }
          ]
        })
      ]
    });
    await ctx.rebuild();
  } finally {
    esbuild.stop();
  }

  assertEquals(
    Deno.readTextFileSync('test/dest/index.html'),
    'page1\n'
  );
  assertEquals(
    Deno.readTextFileSync('test/dest/sub.html'),
    'page2\n'
  );
});
