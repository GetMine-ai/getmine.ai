/**
 * Temporary build manifest.
 *
 * This file is deliberately the only website source of installer metadata
 * until the release service exposes its ruled latest.json contract. The
 * release-link assertion refuses to approve a production flip while either
 * URL remains empty.
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
    url: '',
    version: 'Pending signed build',
    sizeMB: 0,
    filename: 'GetMine-pending.dmg',
    minOs: 'macOS 14 or later',
    signedBy: 'GETMINE LTD',
    sha256: '',
  },
  windows: {
    url: '',
    version: 'Pending signed build',
    sizeMB: 0,
    filename: 'GetMine-Setup-pending.exe',
    minOs: 'Windows 11',
    signedBy: 'GETMINE LTD',
    sha256: '',
  },
};
