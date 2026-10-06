/**
 * Temporary build manifest.
 *
 * This file is deliberately the only website source of installer metadata
 * until the release service exposes its ruled latest.json contract. The
 * release-link assertion refuses to approve a production flip while either
 * URL remains empty.
 *
 * WAVE-9 FILL, COMPLETED 30 SEP 2026 from the published assets (wave-9 = latest).
 * The moment the wave assets are published, fill:
 *   - sha256: the checksum of each published asset (shasum -a 256 <file>)
 *   - sizeMB: the asset size rounded to the nearest MB (0 hides the size line)
 * Then run `pnpm assert:downloads` — it must pass before build:release will.
 */
export interface BuildInfo {
  url: string;
  version: string;
  sizeMB: number;
  filename: string;
  minOs: string;
  signedBy: string;
  sha256: string;
}

export const builds: { mac: BuildInfo; windows: BuildInfo } = {
  mac: {
    url: 'https://github.com/GetMine-ai/releases/releases/download/wave-9/GetMine-Installer.pkg',
    version: 'GetMine-Installer', // see note below: must be a substring of the release identity
    sizeMB: 176.0,
    filename: 'GetMine-Installer.pkg',
    minOs: 'macOS 14 or later',
    signedBy: 'GETMINE LTD',
    sha256: 'af58a075018d60ae01fae7e7e1b3ba4f5ed53a69b85ffd65941bd76836e220cb',
  },
  windows: {
    url: 'https://github.com/GetMine-ai/releases/releases/download/wave-9/GetMine-Setup.exe',
    version: 'GetMine-Setup', // see note below: must be a substring of the release identity
    sizeMB: 80.0,
    filename: 'GetMine-Setup.exe',
    minOs: 'Windows 11',
    signedBy: 'GETMINE LTD',
    sha256: '0463f75f10fbb01c40dca7003d17bc52de8d42e053c315925ba95e0df5b921bf',
  },
};

/**
 * PKB's copies of the two installers, which only /pkb offers (PKB install
 * tagging, ruled 6 Oct 2026). Every wave publishes them beside the originals:
 * the same signed bytes under PKB names. The installer reads its own file name,
 * so a person who downloads from PKB's page is recorded as a PKB install.
 *
 * Same wave, same checksum, same size: only the name differs. So these follow
 * from `builds` and the flip edits `builds` alone, while assert:downloads
 * fetches each copy's own sidecar and refuses a copy whose bytes differ.
 */
const pkbCopy = (build: BuildInfo, filename: string): BuildInfo => ({
  ...build,
  url: build.url.replace(/[^/]+$/, filename),
  version: filename.replace(/\.[^.]+$/, ''),
  filename,
});

export const pkbBuilds: { mac: BuildInfo; windows: BuildInfo } = {
  mac: pkbCopy(builds.mac, 'GetMine-Installer-PKB.pkg'),
  windows: pkbCopy(builds.windows, 'GetMine-Setup-PKB.exe'),
};

/*
 * Why `version` is not the wave tag (measured 1 Sep 2026, not assumed):
 * scripts/assert-download-links.mjs requires `version` to appear in
 * `${response.url} ${content-disposition} ${filename}` AFTER redirects.
 * GitHub release-asset downloads redirect to release-assets.githubusercontent.com
 * and the final URL and disposition carry only the FILENAME — the tag ('wave-4')
 * appears nowhere in the resolved identity. So with the ruled flat asset names,
 * the only string guaranteed present is the filename stem. If the coordinator
 * would rather assert the wave, either (a) name the assets with the wave in them
 * (GetMine-Installer-wave-4.pkg) and set version: 'wave-4', or (b) amend the
 * assert script to also fetch the ORIGINAL url string. Decide before flip;
 * do not ship the wave tag as `version` with these filenames — assert:downloads fails.
 */
