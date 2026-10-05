/**
 * Aum Aurum — order receiver (Google Apps Script web app).
 *
 * The website cart POSTs each order here. The script appends a row to the "Orders" sheet of the
 * spreadsheet it is attached to and sends the order text to Telegram.
 *
 * Script properties (Project Settings → Script properties):
 *   TELEGRAM_TOKEN   — bot token from @BotFather (keep it secret: it lives only here, never on the site)
 *   TELEGRAM_CHAT_ID — chat (or group) id that receives orders
 *
 * Setup: see docs/ORDERS.md.
 */
const MAX = 2000;
const cut = (v) => String(v ?? '').slice(0, MAX);

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'bad request' });
  }
  if (!data || !data.phone || !Array.isArray(data.items) || data.items.length === 0) {
    return json({ ok: false, error: 'empty order' });
  }

  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName('Orders') || book.insertSheet('Orders');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Language', 'Name', 'Phone', 'Delivery', 'Address', 'Comment', 'Items', 'Total', 'Status']);
    sheet.setFrozenRows(1);
  }
  const items = data.items.slice(0, 50).map((i) => `${cut(i.title)}${i.size ? ', ' + cut(i.size) : ''} × ${Number(i.qty) || 1}`).join('\n');
  sheet.appendRow([new Date(), cut(data.lang), cut(data.name), cut(data.phone), cut(data.delivery), cut(data.address), cut(data.comment), items, cut(data.total), 'new']);

  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TELEGRAM_TOKEN');
  const chat = props.getProperty('TELEGRAM_CHAT_ID');
  if (token && chat) {
    UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: chat, text: cut(data.text) || items }),
      muteHttpExceptions: true,
    });
  }
  return json({ ok: true });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
