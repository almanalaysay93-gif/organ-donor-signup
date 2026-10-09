# SHARE Organ Donor Sign-up: Apps Script backend

This script runs as a Google Apps Script web app. It is owned by `spmcotsu@gmail.com`.

For each sign-up it:

1. Saves the row to the sheet `Web Sign-ups`.
2. Emails the donor's next of kin once. The email shows the donor's name, the organs chosen, and the sender `SHARE, Southern Philippines Medical Center`.

Address and birthday are not included in the email.

## Setup

1. Sign in to Google as `spmcotsu@gmail.com`. Open the sheet that stores sign-ups.
2. Go to **Extensions > Apps Script**. Delete the sample code. Paste the script below and save.
3. Go to **Deploy > Manage deployments**. Edit the existing web app, choose **New version**, then **Deploy**. This keeps the same `/exec` URL, so `script.js` needs no change.
   If you create a new deployment instead, copy its `/exec` URL into `SUBMIT_ENDPOINT` in `script.js`.
4. Authorize the Gmail permission when prompted.
5. Check the sheet header row. It must match `HEADERS` in the script. Add any missing column names (for example `Blood Type`) to the right of the existing columns.

## Test

Run `testAppend()` once from the editor. It sends one email to the account running the script (the owner). It does not email any real family.
Delete the `ZZTEST` row from the sheet afterwards.

## Limits

- A consumer Gmail account can send about 100 emails per day.
- When the daily quota is used up, the sign-up is still saved. The sheet shows `Not sent: daily email quota used up`.
- If sending fails for any other reason, the sheet shows `Failed: ...`.

## Script (`apps-script.gs`)

```javascript
/**
 * SHARE — Organ donor sign-up backend (Google Apps Script web app)
 * ---------------------------------------------------------------
 * Receives POSTs from the landing page, appends each sign-up to the sheet,
 * and emails the donor's next of kin once: they learn that the donor pledged
 * and which organs were chosen. Address and birthday are NOT sent in the email.
 *
 * SETUP (owner account must be spmcotsu@gmail.com, so the email is sent from it):
 *  1. Sign in to Google as spmcotsu@gmail.com and open the sheet that stores sign-ups.
 *  2. Extensions > Apps Script. Delete sample code, paste THIS whole file, Save.
 *  3. Deploy > Manage deployments > edit the existing web app > New version > Deploy.
 *     Editing the existing deployment keeps the same /exec URL, so script.js needs no change.
 *     If you create a new deployment instead, copy its /exec URL into script.js (SUBMIT_ENDPOINT).
 *  4. Authorize the Gmail permission when prompted.
 *  5. Sheet: the header row must match HEADERS below. Add any missing column names
 *     (for example "Blood Type") to the right of the existing columns.
 *
 * TEST: run testAppend() once from the editor. It sends one email to the
 * account running the script (the owner). It does not email any real family.
 *
 * Quota: a consumer Gmail account can send about 100 emails per day. When the
 * daily quota is used up, the sign-up is still saved and the sheet shows
 * "Not sent: daily email quota used up".
 */

var SHEET_NAME = 'Web Sign-ups';
var SENDER_NAME = 'SHARE, Southern Philippines Medical Center';
var HEADERS = [
  'Timestamp', 'Full Name', 'Birthday', 'Sex', 'Address', 'Mobile',
  'Organs', 'Email', 'Contact Person', 'Contact Number', 'Conforme',
  'Next of Kin Email', 'Next of Kin Notified', 'Blood Type'
];
var NOTIFIED_COL = HEADERS.indexOf('Next of Kin Notified') + 1;
var ALL_ORGANS_TEXT = 'All organs and tissues to be used for transplantation, research, or education';

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
    var nextOfKinEmail = String(p.nextOfKinEmail || '').trim();

    if (!isEmail_(nextOfKinEmail)) {
      return ContentService.createTextOutput('ERROR: next of kin email is missing or invalid');
    }

    var row = sheet.getLastRow() + 1;
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
      p.conforme || '',
      nextOfKinEmail,
      'Pending',
      p.bloodType || 'Not given'
    ]);

    // Email the next of kin. A failure here must not lose the sign-up, so it is recorded instead.
    var status = 'Sent';
    try {
      if (MailApp.getRemainingDailyQuota() < 1) {
        status = 'Not sent: daily email quota used up';
      } else {
        sendNextOfKinNotice_(p.fullName || 'A donor', p.contactName || '', nextOfKinEmail, organs);
      }
    } catch (mailErr) {
      status = 'Failed: ' + mailErr;
    }
    sheet.getRange(row, NOTIFIED_COL).setValue(status);

    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err);
  } finally {
    lock.releaseLock();
  }
}

function sendNextOfKinNotice_(donorName, kinName, to, organs) {
  var greeting = kinName ? 'Dear ' + kinName + ',' : 'Dear family member,';
  var chosen = organs === ALL_ORGANS_TEXT ? 'All organs and tissues' : organs;
  var body = [
    greeting,
    '',
    donorName + ' has signed up as an organ donor with SHARE, Southern Philippines Medical Center.',
    '',
    'Organs and tissues chosen: ' + chosen,
    '',
    'You are listed as their next of kin. Please talk with them about their decision.',
    '',
    'You are getting this email because the donor entered your address. It is the only message you will get from this sign-up.',
    'If you received it in error, you can reply to this email and we will remove your address.',
    '',
    'SHARE, Southern Philippines Medical Center',
    'J.P. Laurel Avenue, Bajada, Davao City, Philippines'
  ].join('\n');

  MailApp.sendEmail({
    to: to,
    subject: donorName + ' has pledged to be an organ donor',
    body: body,
    name: SENDER_NAME
  });
}

// A GET on the URL just shows it's alive (handy when testing in a browser).
function doGet() {
  return ContentService.createTextOutput('Organ donor form endpoint is running.');
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
  // Sends the test notice to the account running this script, not to a family member.
  var me = Session.getActiveUser().getEmail();
  doPost({
    parameter: {
      fullName: 'ZZTEST - delete me', birthday: '1990-01-15', sex: 'Male',
      address: 'Test', mobile: '09000000000', email: 'zztest@example.com',
      contactName: 'ZZTEST', contactNumber: '09111111111',
      nextOfKinEmail: me, bloodType: 'O+',
      conforme: 'I confirm...'
    },
    parameters: { organs: ['Heart', 'Kidneys'] }
  });
}
```
