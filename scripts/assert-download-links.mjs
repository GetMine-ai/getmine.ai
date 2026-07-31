import { builds } from '../src/data/builds.ts';

const platforms = Object.entries(builds);
const failures = [];

for (const [platform, build] of platforms) {
  if (!build.url) {
    failures.push(`${platform}: no release URL configured`);
    continue;
  }

  let response;
  try {
    response = await fetch(build.url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    failures.push(`${platform}: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  if (response.status !== 200) {
    failures.push(`${platform}: release URL returned HTTP ${response.status}`);
    continue;
  }

  const disposition = response.headers.get('content-disposition') ?? '';
  if (!/\battachment\b/i.test(disposition)) {
    failures.push(`${platform}: response is not marked as an attachment`);
  }

  const releaseIdentity = `${response.url} ${disposition} ${build.filename}`;
  if (!releaseIdentity.includes(build.version)) {
    failures.push(
      `${platform}: configured version ${build.version} is absent from the resolved release identity`,
    );
  }
}

if (failures.length > 0) {
  console.error('Download release assertion failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Download release assertion passed for macOS and Windows.');
