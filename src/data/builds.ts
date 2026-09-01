/**
 * Temporary build manifest.
 *
 * This file is deliberately the only website source of installer metadata
 * until the release service exposes its ruled latest.json contract. The
 * release-link assertion refuses to approve a production flip while either
 * URL remains empty.
 *
 * WAVE-4 FILL, COMPLETED 1 SEP 2026 from the published assets.
 * The moment the wave-4 assets are published, fill:
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
    url: 'https://github.com/GetMine-ai/releases/releases/download/wave-4/GetMine-Installer.pkg',
    version: 'GetMine-Installer', // see note below: must be a substring of the release identity
    sizeMB: 0.1,
    filename: 'GetMine-Installer.pkg',
    minOs: 'macOS 14 or later',
    signedBy: 'GETMINE LTD',
    sha256: 'ba520e4150363e4f1fb1984bf92cdb9e3765e3f10bc852a5d3385d1f0e803fa6',
  },
  windows: {
    url: 'https://github.com/GetMine-ai/releases/releases/download/wave-4/GetMine-Setup.exe',
    version: 'GetMine-Setup', // see note below: must be a substring of the release identity
    sizeMB: 74.5,
    filename: 'GetMine-Setup.exe',
    minOs: 'Windows 11',
    signedBy: 'GETMINE LTD',
    sha256: 'fe38481cf8d483c2223e89667b38b6419ea378739b66dfe4a9eae8078043ae90',
  },
};

/*
 * Why `version` is not 'wave-4' (measured 1 Sep 2026, not assumed):
 * scripts/assert-download-links.mjs requires `version` to appear in
 * `${response.url} ${content-disposition} ${filename}` AFTER redirects.
 * GitHub release-asset downloads redirect to release-assets.githubusercontent.com
 * and the final URL and disposition carry only the FILENAME — the tag ('wave-4')
 * appears nowhere in the resolved identity. So with the ruled flat asset names,
 * the only string guaranteed present is the filename stem. If the coordinator
 * would rather assert the wave, either (a) name the assets with the wave in them
 * (GetMine-Installer-wave-4.pkg) and set version: 'wave-4', or (b) amend the
 * assert script to also fetch the ORIGINAL url string. Decide before flip;
 * do not ship version: 'wave-4' with these filenames — assert:downloads fails.
 */
