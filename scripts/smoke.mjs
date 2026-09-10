import assert from 'node:assert/strict';

const web = process.env.WEB_URL || 'http://localhost:3000';
const platform = process.env.PLATFORM_URL || 'http://localhost:3001';
for (const path of ['/', '/about', '/training', '/agriculture', '/contact']) {
  const response = await fetch(new URL(path, web));
  assert.equal(response.status, 200, `Public route ${path}`);
  const html = await response.text();
  assert.ok(html.includes('SAQR'), `${path} includes the brand`);
  console.log(`PASS public ${path}`);
}
for (const path of ['/login', '/register']) {
  const response = await fetch(new URL(path, platform));
  assert.equal(response.status, 200, `Auth route ${path}`);
  console.log(`PASS auth page ${path}`);
}
for (const path of [
  '/dashboard',
  '/courses',
  '/courses/agricultural-drone-operations',
  '/learn/agricultural-drone-operations/agriculture-lesson-1',
  '/pilot-profile',
  '/assessments',
  '/certificates',
  '/ai',
  '/settings',
]) {
  const response = await fetch(new URL(path, platform));
  // App Router may stream a redirect; verify no student content is exposed either way.
  const html = await response.text();
  assert.ok(
    response.url.includes('/login') || html.includes('NEXT_REDIRECT'),
    `${path} requires authentication`,
  );
  assert.ok(
    !html.includes('Demo learning data ·'),
    `${path} does not leak dashboard content`,
  );
  console.log(`PASS protected ${path}`);
}
const unknown = await fetch(new URL('/this-route-does-not-exist', web));
assert.equal(unknown.status, 404);
console.log('PASS unknown public route returns 404');
