import { builds, pkbBuilds } from '../src/data/builds.ts';
import { pathToFileURL } from 'node:url';

export function releaseTargetErrors(tag, groups = [builds, pkbBuilds]) {
  if (!tag || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(tag)) {
    return ['Set the WEBSITE_RELEASE_TAG repository variable to the approved installer release tag before publishing main.'];
  }
  if (tag === 'wave-11') return ['Wave 11 is not the approved RC4 installer release.'];
  const errors = [];
  for (const group of groups) for (const [platform, build] of Object.entries(group)) {
    const expected = `https://github.com/GetMine-ai/releases/releases/download/${tag}/`;
    if (!build.url.startsWith(expected) || !build.url.endsWith('/' + build.filename)) {
      errors.push(`${platform}: installer does not match approved release ${tag}: ${build.url}`);
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = releaseTargetErrors(process.env.WEBSITE_RELEASE_TAG);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else console.log('Installer release target matches the approved publication tag.');
}
