/**
 * APPEAL Summerwear — Booth Order Log backend
 * ------------------------------------------------------------------
 * Paste this into the Apps Script editor of the Google Sheet that will
 * hold the data (Extensions ▸ Apps Script), then Deploy ▸ New deployment
 * ▸ Web app, "Execute as: Me", "Who has access: Anyone".
 * Copy the /exec URL it gives you into the booth page once per device.
 *
 * Two tabs are created automatically:
 *   Orders — one row per item line
 *   Config — the dropdown lists, promo tiers and admin PIN
 */

var ORDERS = 'Orders';
var CONFIG = 'Config';

/* Column order in the Orders tab. Adding a column here adds it everywhere. */
var COLS = [
  'id','orderNo','lineNo','lines','event','date','time','pic',
  'qty','model','color','size','unitPrice','totalPrice',
  'discountType','discountValue','discountAmount','totalPayment',
  'isThai','nationality','gender','age','note','createdAt'
];

var CONFIG_KEYS = ['events','pics','models','colors','sizes','nats','promo','variants','prices','adminPin','staffPins'];
var LIST_KEYS   = ['events','pics','models','colors','sizes','nats'];

/* ---------- helpers ---------- */

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function book_() { return SpreadsheetApp.getActiveSpreadsheet(); }

function ordersSheet_() {
  var ss = book_();
  var sh = ss.getSheetByName(ORDERS);
  if (!sh) {
    sh = ss.insertSheet(ORDERS);
    sh.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function configSheet_() {
  var ss = book_();
  var sh = ss.getSheetByName(CONFIG);
  if (!sh) {
    sh = ss.insertSheet(CONFIG);
    sh.getRange(1, 1, 1, 2).setValues([['key', 'value']]).setFontWeight('bold');
    sh.setFrozenRows(1);
    var seed = [
      ["events", "EMP SPM 2F 10SEP-23SEP"],
      ["pics", "อีฟ (ชนัญญา พูนบำเพ็ญ)"],
      ["models", "1145 (EASY RUNNING SHORTS)\nP118 (BEACH BOARDSHORTS)\nBWL004 (EVERYDAY SHIRT)\nBWL005 (HOLIDAY STRIPE SHIRT)\nAPR BIKER (APR BIKER)\nAPRL Polo (APRL POLO)\nASP013 (SEARCH PANTS)\nASP016 (UV JACKET)\nCSAP001 (CITY BRA)\nCSAP004 (NOW HERE BRA)\nCSAP008 (CAMP SHORTS)\nCSAP009 (SANDTONE PANTS)\nP128 (JOY VIBE SKIRT)\nP125 (JOY VIBE TOP)\nTime Pants (TIME PANTS)\nTrain Time Tight (TRAIN TIME TIGHT PANTS)\nUltra Move Capri (ULTRA MOVE CAPRI)\nAC038 (BANDANA)\nCC019 (BOARDSHORTS)\nCC026 (SUMMER BEACH SHIRT)\nCC028 (SUMMER BEACH SHIRT)\nCC035 (BOARDSHORTS)\nAPT001 (SUMMER TEE)\nAPT002 (SUMMER TEE)\nAPT004 (SUMMER TEE)\nCC027 (SUMMER HOLIDAY DREAMS)\nCCKID019 (KIDS BOARDSHORTS)\nCCKID026 (KIDS SUMMER BEACH SHIRT)\nAC028 (ADVENTURE CAP)\nAC029 (SUMMER CAP)\nAC039 (SUMMER CAP)"],
      ["colors", "Blue Beach\nGrey\nBlack\nBrick\nNavy\nWhite\nSand\nPalm Paradise\nSandy Coasts\nTriple Hill\nPink\nBrown\nMuted Pink\nCream\nMidnight\nPurple\nBlue Mist\nOrange\nWine\nGreen\nIris\nForest\nBlue\nAlive\nBlissful Blue\nEase\nGolden Glow\nReef\nBeach Paradise\nWhite Coconut\nNavy Coconut\nNavy Turtle\nWave Rider\nVilla Breeze\nSunny en Route\nSea เก่า\nPalm เก่า\nSun\nSky\nMeaning\nClub\nActivity\nThe Summer Sun\nSea lobster\nQuad Islands\nAP-01Sunrise\nAP-02SeaSky\nAP-05Palm\nCULT-01Ocean\nCULT-02Sunrise\nCULT-03Sunrise Ocean\nCULT-04Midnight\nSunrise Whisper\nThe Andaman Blue\nTropical melt\nIsland solitude\nGood surfing\nLove! This's brown\nManta\nOh! Red\nRight! My blue\nCoastal Club\nSea\nPalm"],
      ["sizes", "XS\nS\nM\nL\nXL\nXXL\nFree size"],
      ["nats", "Thai\nChinese\nJapanese\nKorean\nRussian\nAmerican\nBritish\nGerman\nFrench\nAustralian\nIndian\nSingaporean\nMalaysian\nOther · อื่นๆ (ระบุ)"],
      ["promo", "2=5, 3=10"],
      ["variants", "1145 (EASY RUNNING SHORTS)=Blue Beach, Grey, Black\nP118 (BEACH BOARDSHORTS)=Brick, Grey, Navy, Black, White\nBWL004 (EVERYDAY SHIRT)=Black, White, Sand\nBWL005 (HOLIDAY STRIPE SHIRT)=Blue Beach, Palm Paradise, Sandy Coasts, Triple Hill\nAPR BIKER (APR BIKER)=Pink, Navy, Black, Brown\nAPRL Polo (APRL POLO)=Navy\nASP013 (SEARCH PANTS)=Black, Muted Pink, Brown\nASP016 (UV JACKET)=Cream, White\nCSAP001 (CITY BRA)=Cream\nCSAP004 (NOW HERE BRA)=Brown\nCSAP008 (CAMP SHORTS)=Cream\nCSAP009 (SANDTONE PANTS)=Brown\nP128 (JOY VIBE SKIRT)=Midnight, White, Purple, Blue Mist\nP125 (JOY VIBE TOP)=Blue Mist, Purple, Midnight\nTime Pants (TIME PANTS)=Orange\nTrain Time Tight (TRAIN TIME TIGHT PANTS)=Wine, Blue Beach, Green\nUltra Move Capri (ULTRA MOVE CAPRI)=Iris, Forest, Black, Wine, Blue\nAC038 (BANDANA)=Alive, Blissful Blue, Ease, Golden Glow, Midnight, Reef, Beach Paradise\nCC019 (BOARDSHORTS)=White Coconut, Navy Coconut, Navy Turtle, Wave Rider, Villa Breeze, Sunny en Route, Sea เก่า, Palm เก่า\nCC026 (SUMMER BEACH SHIRT)=White Coconut, Navy Coconut, Navy Turtle, Wave Rider, Villa Breeze, Sunny en Route, Sea เก่า\nCC028 (SUMMER BEACH SHIRT)=Sun, Sky, Sea, Palm\nCC035 (BOARDSHORTS)=Sun, Sky, Sea, Palm\nAPT001 (SUMMER TEE)=Meaning, Club, Activity, The Summer Sun, Sea lobster, Quad Islands\nAPT002 (SUMMER TEE)=AP-01Sunrise, AP-02SeaSky, AP-05Palm\nAPT004 (SUMMER TEE)=CULT-01Ocean, CULT-02Sunrise, CULT-03Sunrise Ocean, CULT-04Midnight\nCC027 (SUMMER HOLIDAY DREAMS)=Sunrise Whisper, The Andaman Blue, Tropical melt, Island solitude\nCCKID019 (KIDS BOARDSHORTS)=White Coconut, Navy Coconut, Navy Turtle\nCCKID026 (KIDS SUMMER BEACH SHIRT)=White Coconut, Navy Coconut, Navy Turtle\nAC028 (ADVENTURE CAP)=Brick, Black, Grey, Navy, Cream\nAC029 (SUMMER CAP)=Good surfing, Love! This's brown, Manta, Oh! Red, Right! My blue, Sea lobster\nAC039 (SUMMER CAP)=Coastal Club"],
      ["prices", "1145 (EASY RUNNING SHORTS)=890\nP118 (BEACH BOARDSHORTS)=890\nBWL004 (EVERYDAY SHIRT)=890\nBWL005 (HOLIDAY STRIPE SHIRT)=990\nAPR BIKER (APR BIKER)=990\nAPRL Polo (APRL POLO)=1490\nASP013 (SEARCH PANTS)=1490\nASP016 (UV JACKET)=1190\nCSAP001 (CITY BRA)=1190\nCSAP004 (NOW HERE BRA)=1190\nCSAP008 (CAMP SHORTS)=1290\nCSAP009 (SANDTONE PANTS)=1490\nP128 (JOY VIBE SKIRT)=1290\nP125 (JOY VIBE TOP)=1190\nAC038 (BANDANA)=690\nCC019 (BOARDSHORTS)=890\nCC026 (SUMMER BEACH SHIRT)=1490\nCC028 (SUMMER BEACH SHIRT)=1490\nCC035 (BOARDSHORTS)=890\nAPT001 (SUMMER TEE)=690\nAPT002 (SUMMER TEE)=690\nAPT004 (SUMMER TEE)=690\nCC027 (SUMMER HOLIDAY DREAMS)=1490\nCCKID019 (KIDS BOARDSHORTS)=690\nCCKID026 (KIDS SUMMER BEACH SHIRT)=990\nAC028 (ADVENTURE CAP)=790\nAC029 (SUMMER CAP)=690\nAC039 (SUMMER CAP)=690"],
      ["adminPin", ""],
      ["staffPins", ""]
    ];
    sh.getRange(2, 1, seed.length, 2).setValues(seed);
    sh.setColumnWidth(2, 420);
  }
  return sh;
}

function readConfig_() {
  var sh = configSheet_();
  var last = sh.getLastRow();
  var out = {};
  if (last > 1) {
    var vals = sh.getRange(2, 1, last - 1, 2).getValues();
    vals.forEach(function (r) {
      var k = String(r[0]).trim();
      if (!k) return;
      var v = r[1] == null ? '' : String(r[1]);
      out[k] = (LIST_KEYS.indexOf(k) >= 0)
        ? v.split('\n').map(function (s) { return s.trim(); }).filter(String)
        : v;
    });
  }
  return out;
}

function writeConfig_(cfg) {
  var sh = configSheet_();
  var rows = CONFIG_KEYS.map(function (k) {
    var v = cfg[k];
    if (Array.isArray(v)) v = v.join('\n');
    return [k, v == null ? '' : String(v)];
  });
  var last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, 2).clearContent();
  sh.getRange(2, 1, rows.length, 2).setValues(rows);
}

/* ---------- who is asking ----------
 * Config holds two kinds of PIN:
 *   adminPin  — the owner. Sees every row, every day, and can edit settings.
 *   staffPins — one line per seller, "ชื่อ=PIN". Sees only their own rows, today.
 * With neither set the log is open to anyone with the URL, as it was before.   */

function staffMap_(cfg) {
  var map = {};
  String(cfg.staffPins || '').split('\n').forEach(function (line) {
    var i = line.lastIndexOf('=');
    if (i < 1) return;
    var name = line.slice(0, i).trim();
    var pin  = line.slice(i + 1).trim();
    if (name && pin) map[pin] = name;
  });
  return map;
}

/* Four answers:
 *   owner — the admin PIN, or nothing locked at all. Everything.
 *   staff — a personal PIN. Their own sales, today.
 *   guest — no staff PINs are set up, so the shared view as it always was:
 *           today's sales for the whole booth, no settings.
 *   none  — staff PINs ARE set up and this is not one of them. Nothing. */
function whoIs_(cfg, pin) {
  pin = String(pin == null ? '' : pin).trim();
  var admin = String(cfg.adminPin || '').trim();
  var staff = staffMap_(cfg);
  var hasStaff = Object.keys(staff).length > 0;
  if (admin && pin === admin) return { role: 'owner', name: '' };
  if (pin && staff[pin]) return { role: 'staff', name: staff[pin] };
  if (!admin && !hasStaff)  return { role: 'owner', name: '' };
  if (!hasStaff)            return { role: 'guest', name: '' };
  return { role: 'none', name: '' };
}

/* The PINs themselves never leave the Sheet unless the owner is asking. */
function publicConfig_(cfg, who) {
  var out = {};
  Object.keys(cfg).forEach(function (k) {
    if (k === 'adminPin' || k === 'staffPins') return;
    out[k] = cfg[k];
  });
  out.hasAdminPin  = !!String(cfg.adminPin || '').trim();
  out.hasStaffPins = Object.keys(staffMap_(cfg)).length > 0;
  if (who.role === 'owner') {
    out.adminPin  = cfg.adminPin  || '';
    out.staffPins = cfg.staffPins || '';
  }
  return out;
}

function today_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/* Staff see "today". The device says which day it is on; we accept it only when
 * it is within a day of the script's own clock, so a wrong project timezone
 * cannot hide a seller's own sales, and nobody can ask for last week. */
function scopeDate_(want) {
  var t = today_();
  want = String(want == null ? '' : want).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(want)) return t;
  var diff = Math.abs(new Date(want + 'T00:00:00Z') - new Date(t + 'T00:00:00Z')) / 86400000;
  return diff <= 1 ? want : t;
}

/* Dates are stored as plain yyyy-mm-dd text so no locale can reinterpret them. */
function asText_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return v == null ? '' : String(v);
}

function readOrders_() {
  var sh = ordersSheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var vals = sh.getRange(2, 1, last - 1, COLS.length).getValues();
  var out = [];
  for (var i = 0; i < vals.length; i++) {
    var row = vals[i];
    if (!row[0]) continue;                       // skip blanks left by deletes
    var o = {};
    for (var c = 0; c < COLS.length; c++) {
      var key = COLS[c], v = row[c];
      if (key === 'qty' || key === 'lineNo' || key === 'lines' ||
          key === 'unitPrice' || key === 'totalPrice' || key === 'discountValue' ||
          key === 'discountAmount' || key === 'totalPayment') {
        o[key] = (v === '' || v == null) ? '' : Number(v);
      } else {
        o[key] = asText_(v);
      }
    }
    out.push(o);
  }
  return out;
}

/**
 * Next order number for a date, e.g. 2026-09-10-004.
 * Read inside the lock so two phones saving at once cannot collide.
 */
function nextOrderNo_(sh, date) {
  var last = sh.getLastRow();
  var max = 0;
  if (last >= 2) {
    var dates = sh.getRange(2, 6, last - 1, 1).getValues();   // column F = date
    var nos   = sh.getRange(2, 2, last - 1, 1).getValues();   // column B = orderNo
    for (var i = 0; i < dates.length; i++) {
      if (asText_(dates[i][0]) !== date) continue;
      var m = String(nos[i][0]).match(/(\d+)$/);
      if (m) { var n = parseInt(m[1], 10); if (n > max) max = n; }
    }
  }
  var next = max + 1;
  return date + '-' + ('00' + next).slice(-3);
}

/* ---------- endpoints ---------- */

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var action = p.action || 'list';
    if (action === 'ping') return json_({ ok: true, pong: true });

    var cfg = readConfig_();
    var who = whoIs_(cfg, p.pin);

    if (action === 'list' || action === 'config') {
      var out = { ok: true, role: who.role, me: who.name, config: publicConfig_(cfg, who) };
      if (action === 'list') {
        /* The filter is here, not in the page: a seller's browser never
         * receives anyone else's rows in the first place. */
        var day = scopeDate_(p.date);
        if (who.role === 'owner') {
          out.rows = readOrders_();
        } else if (who.role === 'staff') {
          out.rows = readOrders_().filter(function (r) {
            return r.pic === who.name && r.date === day;
          });
        } else if (who.role === 'guest') {
          out.rows = readOrders_().filter(function (r) { return r.date === day; });
        } else {
          out.rows = [];
        }
      }
      return json_(out);
    }
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, error: 'busy, try again' });
  }
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var cfg = readConfig_();
    var who = whoIs_(cfg, body.pin);
    if (who.role === 'none') return json_({ ok: false, error: 'pin required' });

    if (body.action === 'addOrder') {
      var sh = ordersSheet_();
      var date = String(body.date || '');
      var orderNo = nextOrderNo_(sh, date);
      var lines = body.rows || [];
      var values = lines.map(function (r) {
        r.id = Utilities.getUuid();
        r.orderNo = orderNo;
        /* A seller's own PIN signs the sale — the name cannot be typed over. */
        if (who.role === 'staff') r.pic = who.name;
        return COLS.map(function (k) { return r[k] == null ? '' : r[k]; });
      });
      if (values.length) {
        sh.getRange(sh.getLastRow() + 1, 1, values.length, COLS.length)
          .setValues(values)
          .setNumberFormat('@');                 // keep dates and SKUs as text
      }
      return json_({ ok: true, orderNo: orderNo, saved: values.length });
    }

    if (body.action === 'deleteRow') {
      var sh2 = ordersSheet_();
      var last = sh2.getLastRow();
      if (last >= 2) {
        var vals2 = sh2.getRange(2, 1, last - 1, COLS.length).getValues();
        for (var i = 0; i < vals2.length; i++) {
          if (String(vals2[i][0]) !== String(body.id)) continue;
          /* Staff may undo their own sale from today, nothing else.
           * The shared guest view may undo anything from today. */
          var rowPic  = asText_(vals2[i][COLS.indexOf('pic')]);
          var rowDate = asText_(vals2[i][COLS.indexOf('date')]);
          if (who.role === 'staff' && (rowPic !== who.name || rowDate !== scopeDate_(body.date))) {
            return json_({ ok: false, error: 'not yours' });
          }
          if (who.role === 'guest' && rowDate !== scopeDate_(body.date)) {
            return json_({ ok: false, error: 'today only' });
          }
          sh2.deleteRow(i + 2);
          return json_({ ok: true, deleted: body.id });
        }
      }
      return json_({ ok: true, deleted: null });
    }

    if (body.action === 'saveConfig') {
      if (who.role !== 'owner') return json_({ ok: false, error: 'owner only' });
      writeConfig_(body.config || {});
      return json_({ ok: true });
    }

    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Run once from the editor to create the tabs before deploying. */
function setup() {
  ordersSheet_();
  configSheet_();
  SpreadsheetApp.getUi().alert('Orders and Config tabs are ready. Now Deploy ▸ New deployment ▸ Web app.');
}
