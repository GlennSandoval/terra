import {copyFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = resolve(import.meta.dir, '..');
const build = Bun.spawn([process.execPath, 'run', 'build'], {
  cwd: root,
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
});
const exitCode = await build.exited;

if (exitCode !== 0) {
  process.exit(exitCode);
}

await copyFile(resolve(root, 'dist/terra.min.js'), resolve(root, 'demo/terra.min.js'));
