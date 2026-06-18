/**
 * Organ Donor Sign-up — backend (Google Apps Script web app)
 * ---------------------------------------------------------------
 * Receives POSTs from the landing page and appends each submission
 * as a row in your Google Sheet. No Google login required for donors.
 *
 * SETUP (one time):
 *  1. Open the Google Sheet you want the sign-ups to land in.
 *  2. Extensions > Apps Script.
 *  3. Delete any sample code, paste THIS whole file, click Save.
 *  4. Deploy > New deployment > (gear) Web app.
 *       - Description: Organ Donor form
 *       - Execute as: Me
 *       - Who has access: Anyone          <-- important (no login)
 *     Deploy, authorize when prompted, then COPY the Web app URL
 *     (it ends in /exec).
 *  5. Paste that URL into script.js  ->  SUBMIT_ENDPOINT.
 *
 * To TEST: run testAppend() once from the editor — it adds a ZZTEST row.
 * If you ever change the form fields, update HEADERS + the row below.
 */

var SHEET_NAME = 'Web Sign-ups';
var HEADERS = [
  'Timestamp', 'Full Name', 'Birthday', 'Sex', 'Address', 'Mobile',
  'Organs', 'Email', 'Contact Person', 'Contact Number', 'Conforme'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // avoid two submits clobbering each other
  try {
    var sheet = getSheet_();
    var p = (e && e.parameter) ? e.parameter : {};
    // Checkboxes share the name "organs" -> arrive as a list:
    var organs = (e && e.parameters && e.parameters.organs)
      ? e.parameters.organs.join(', ')
      : (p.organs || '');

    sheet.appendRow([
      new Date(),
      p.fullName || '',
      p.birthday || '',
      p.sex || '',
      p.address || '',
      p.mobile || '',
      organs,
      p.email || '',
      p.contactName || '',
      p.contactNumber || '',
      p.conforme || ''
    ]);
    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err);
  } finally {
    lock.releaseLock();
  }
}

// A GET on the URL just shows it's alive (handy when testing in a browser).
function doGet() {
  return ContentService.createTextOutput('Organ Donor form endpoint is running.');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function testAppend() {
  doPost({
    parameter: {
      fullName: 'ZZTEST - delete me', birthday: '1990-01-15', sex: 'Male',
      address: 'Test', mobile: '09000000000', email: 'zztest@example.com',
      contactName: 'ZZTEST', contactNumber: '09111111111',
      conforme: 'I confirm...'
    },
    parameters: { organs: ['Heart', 'Kidneys'] }
  });
}
