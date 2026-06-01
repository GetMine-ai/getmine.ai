// GetMine.ai web endpoints — Google Apps Script Web App.
//
// Single deployed endpoint handles three modes via the `mode` POST parameter:
//   - mode=waitlist     (default) — append a row to the Waitlist sheet
//   - mode=check_beta              — look up email in Beta_Allowlist, log attempt
//   - mode=log_download            — record a download click in Beta_Access_Log
//
// Deploy / redeploy:
//   1. Open the Sheet → Extensions → Apps Script.
//   2. Paste this file as Code.gs. Save.
//   3. First deploy: Deploy → New deployment → Type: Web app.
//         Execute as: Me
//         Who has access: Anyone   ← must be "Anyone", not "Anyone with Google account"
//   4. Subsequent edits: Deploy → Manage deployments → pencil icon →
//      Version: New version → Deploy. The /exec URL stays the same.
//   5. Copy the /exec URL into WAITLIST_ENDPOINT in index.html (only on first deploy).
//
// All three tabs (Waitlist, Beta_Allowlist, Beta_Access_Log) are created
// automatically on first use with the right headers.

const WAITLIST_SHEET    = 'Waitlist';
const ALLOWLIST_SHEET   = 'Beta_Allowlist';
const ACCESS_LOG_SHEET  = 'Beta_Access_Log';

const WAITLIST_HEADERS = [
  'timestamp','name','email','phone',
  'q1_household','q2_nhs_app','q3_care_mix','q4_insurance','q5_wearables',
  'user_agent','referrer'
];
const ALLOWLIST_HEADERS  = ['email','name','cohort','status','added_at','notes'];
const ACCESS_LOG_HEADERS = ['timestamp','mode','email','allowed','os','user_agent','referrer'];

function ensureSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const p = (e && e.parameter) || {};
    const mode = String(p.mode || 'waitlist').toLowerCase();

    // ── mode: waitlist (default — preserves original behaviour) ────────
    if (mode === 'waitlist') {
      const sheet = ensureSheet(ss, WAITLIST_SHEET, WAITLIST_HEADERS);
      sheet.appendRow(WAITLIST_HEADERS.map(h =>
        h === 'timestamp' ? new Date() : (p[h] || '')
      ));
      return jsonResponse({ ok: true });
    }

    // ── mode: check_beta ───────────────────────────────────────────────
    if (mode === 'check_beta') {
      const email = String(p.email || '').trim().toLowerCase();
      const allowlist = ensureSheet(ss, ALLOWLIST_SHEET, ALLOWLIST_HEADERS);
      const log       = ensureSheet(ss, ACCESS_LOG_SHEET, ACCESS_LOG_HEADERS);

      let match = null;
      if (email) {
        const rows = allowlist.getDataRange().getValues();
        for (let i = 1; i < rows.length; i++) {
          const rowEmail  = String(rows[i][0] || '').trim().toLowerCase();
          const rowName   = String(rows[i][1] || '');
          const rowCohort = String(rows[i][2] || '');
          const rowStatus = String(rows[i][3] || '').trim().toLowerCase();
          if (rowEmail === email && rowStatus === 'active') {
            match = { name: rowName, cohort: rowCohort };
            break;
          }
        }
      }

      log.appendRow([
        new Date(), 'check_beta', email, match ? 'yes' : 'no',
        '', p.user_agent || '', p.referrer || ''
      ]);

      return jsonResponse(match
        ? { ok: true, allowed: true, name: match.name, cohort: match.cohort }
        : { ok: true, allowed: false });
    }

    // ── mode: log_download ─────────────────────────────────────────────
    if (mode === 'log_download') {
      const email = String(p.email || '').trim().toLowerCase();
      const os    = String(p.os || '').trim();
      const log   = ensureSheet(ss, ACCESS_LOG_SHEET, ACCESS_LOG_HEADERS);
      log.appendRow([
        new Date(), 'download', email, '', os,
        p.user_agent || '', p.referrer || ''
      ]);
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: 'unknown mode: ' + mode });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('GetMine endpoints are live.');
}
