// GetMine.ai waitlist capture — Google Apps Script Web App.
//
// Deploy:
//   1. Create a new Google Sheet. Open Extensions → Apps Script.
//   2. Paste this file as Code.gs. Save.
//   3. Deploy → New deployment → Type: Web app.
//         Execute as: Me
//         Who has access: Anyone
//   4. Copy the /exec URL and paste it into WAITLIST_ENDPOINT in index.html.
//
// The first POST creates the Waitlist sheet and header row automatically.

const SHEET_NAME = 'Waitlist';
const HEADERS = [
  'timestamp','name','email','phone',
  'q1_household','q2_nhs_app','q3_care_mix','q4_insurance','q5_wearables',
  'user_agent','referrer'
];

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    const p = e.parameter || {};
    sheet.appendRow(HEADERS.map(h => h === 'timestamp' ? new Date() : (p[h] || '')));
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('GetMine waitlist endpoint is live.');
}
