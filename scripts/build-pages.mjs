import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Build an isolated copy so the server-only form route and local env files
// never enter the Pages build, and normal development stays untouched.
const source = resolve('apps/web');
const staging = await mkdtemp(resolve('apps/.pages-web-'));
try {
  await cp(source, staging, {
    recursive: true,
    filter: (path) =>
      !['node_modules', '.next', 'out', 'api'].includes(
        path.split(/[\\/]/).at(-1),
      ) && !path.split(/[\\/]/).at(-1).startsWith('.env'),
  });
  await symlink(
    join(source, 'node_modules'),
    join(staging, 'node_modules'),
    process.platform === 'win32' ? 'junction' : 'dir',
  );
  const build = spawnSync(
    process.execPath,
    [join(source, 'node_modules/next/dist/bin/next'), 'build', staging],
    {
      stdio: 'inherit',
      env: { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: 'true' },
    },
  );
  if (build.status !== 0) throw new Error('Pages build failed');
  await mkdir(join(source, 'out'), { recursive: true });
  await rm(join(source, 'out'), { recursive: true, force: true });
  await cp(join(staging, 'out'), join(source, 'out'), { recursive: true });
  await writeFile(join(source, 'out/.nojekyll'), '');
} finally {
  await rm(staging, { recursive: true, force: true });
}
