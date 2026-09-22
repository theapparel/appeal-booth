# APPEAL Booth Order Log — setup

Two pieces: a **Google Sheet** that holds the data, and a **web page on GitHub Pages** that staff open on any phone. No login for staff, works on any device with the link.

Total time: about 15 minutes, once.

---

## Part 1 — The Google Sheet (the database)

1. Go to **sheets.new** and name the spreadsheet something like `APPEAL Booth Orders`.
2. **Extensions ▸ Apps Script**. Delete whatever is in the editor.
3. Paste in the whole contents of **`Code.gs`**, then click the save icon.
4. In the toolbar, pick the function **`setup`** and press **Run**. Google asks for permission the first time — choose your account, click *Advanced ▸ Go to (project name)*, then *Allow*. This is Google warning you about your own script; it only touches this one spreadsheet.
   → Back in the Sheet you should now see two tabs: **Orders** and **Config**.
5. **Deploy ▸ New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Description: `booth log`
   - **Execute as: Me**
   - **Who has access: Anyone** ← this is what lets staff use it without a Google login
   - Click **Deploy**, approve if asked.
6. Copy the **Web app URL**. It ends in `/exec`. Keep it somewhere — you'll paste it in Part 3.

> **What "Anyone" means.** Anyone who has the long random URL can send data to this Sheet. It is not indexed and not guessable, but treat it like a key: share it only with staff. Nobody can read or edit your Sheet itself — only add orders through the form.

---

## Part 2 — The page on GitHub Pages

1. Sign in at **github.com** (free account is fine).
2. **New repository** → name it `appeal-booth` → **Public** → Create.
   *(Public only means the HTML file is public. Your sales data is in the Sheet, not in this file.)*
3. On the repo page click **Add file ▸ Upload files**, drag in **`index.html`**, then **Commit changes**.
4. **Settings ▸ Pages**. Under "Build and deployment", Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)**. Save.
5. Wait a minute, then refresh. GitHub shows the live address:
   `https://<your-username>.github.io/appeal-booth/`

That is the link you give staff.

---

## Part 3 — Connect the two

1. Open the GitHub Pages link on the booth phone or PC.
2. It asks once for the **Web app URL** — paste the `/exec` link from Part 1 step 6 and press **เชื่อมต่อ**.
3. Done. That device remembers it. Repeat once per device.

**Want to skip step 2 on every device?** Open `index.html` before uploading and put the URL into the line near the top:

```js
var API_URL = "https://script.google.com/macros/s/…/exec";
```

Then no device ever asks. (Anyone who views the page source can see that URL — same trade-off as sharing the link itself.)

---

## Daily use

- **Add to Home Screen** on each phone (Safari: Share ▸ Add to Home Screen; Chrome: ⋮ ▸ Add to Home screen). It then opens like an app, full screen.
- Event, date, time and PIC fill themselves in. Staff pick a **SKU (PRODUCT NAME)**, the unit price appears automatically, they add colour, size and quantity. The promo discount applies itself from the piece count. Then **บันทึกออเดอร์**.
- **↻** pulls the latest rows from other devices. The page does not live-sync — press ↻ to see what another phone just recorded.
- **No signal?** Orders are kept on the device and sent automatically when the connection returns. A coral **รอส่ง N** badge appears in the header while any are waiting — don't clear the browser data while it shows.
- **ดาวน์โหลด [date]** exports that one day as CSV. The full export is in **ตั้งค่า · Admin**.

---

## Admin

Open **ตั้งค่า · Admin** on the page to edit:

- the Model/SKU, colour, size, event, PIC and nationality lists
- the **price book** — one line per item, `SKU (PRODUCT NAME)=price`. When staff pick a model the unit price fills itself in (the box turns blue to show it came from the book) and they can still type over it. An item missing from the book just means they type the price by hand.
- the promotion tiers — `2=5, 3=10` means *2 pieces −5%, 3 or more −10%*. Clear it for no promo.
- the **owner PIN** and the **staff PINs** — see below.

Your 31 SKUs, 64 colours and their prices from `The Apparel _ Booth Popups` are already loaded. Everything saves back to the **Config** tab of the Sheet, so all devices pick it up on their next refresh. You can also edit that tab directly in the Sheet — one option per line.

---

## PINs — one per person

Two kinds, both in **ตั้งค่า · Admin** and both stored in the Sheet's **Config** tab.

**Owner PIN** (`adminPin`) — you. Every day, every seller, delete rows, edit settings, full export. Never remembered by the browser: you re-enter it each time, on purpose. Leave it blank and nothing is locked.

**Staff PINs** (`staffPins`) — one line per seller:

```
อีฟ (ชนัญญา พูนบำเพ็ญ)=9182
นุ่น (วรรณิกา ธาราชัย)=0331
```

What a seller gets when they sign in with their own PIN:

- The device **remembers them** until someone presses **ออก** — so it is a one-time setup per PC, not a daily login.
- **ผู้ขาย · PIC fills itself in and cannot be edited.** The server writes the name from the PIN, so a sale can only be signed by the person who made it.
- The ledger, the สรุป summary, the totals and the day's CSV show **only their own sales, today**. No date filter, no past days, no other seller, no Admin sheet, no full export.
- They can still undo their own just-saved order.

**The separation is done in the Sheet, not in the page.** A seller's browser is never sent anyone else's rows, so it is not something that can be uncovered by poking at the page. Two caveats worth knowing: the `/exec` URL is public, so use PINs that are not guessable in a few tries — six digits rather than four is a cheap upgrade; and anyone with a valid PIN sees what that PIN is entitled to, so treat them like door keys and change one if a seller leaves.

Blank the staff list and everything goes back to how it was: everyone on the link sees the same thing.

> Order numbers stay shared and sequential across sellers — the Sheet assigns them — so #007 is the seventh order of the day at the booth, not the seventh of anyone's own.

---

## Where the data lives

The **Orders** tab, one row per item line. Columns:

`id, orderNo, lineNo, lines, event, date, time, pic, qty, model, color, size, unitPrice, totalPrice, discountType, discountValue, discountAmount, totalPayment, isThai, nationality, gender, age, note, createdAt`

- A customer buying 3 pieces = 3 rows sharing one `orderNo`, marked `lineNo` 1/3, 2/3, 3/3.
- `totalPrice` = `qty × unitPrice`. The order discount is split across the lines in proportion to their value, so `totalPayment` across the rows adds up exactly to what the customer paid.
- Order numbers are assigned by the Sheet, not the phone, so two devices saving at once cannot land on the same number.
- Pivot the tab directly in Sheets for anything the page's สรุป view doesn't cover.

**Don't reorder or rename the columns** — the script writes by position. Adding your own columns to the right is fine.

---

## If something goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| "โหลดข้อมูลไม่สำเร็จ" on every device | Deployment not set to *Anyone* | Deploy ▸ Manage deployments ▸ edit ▸ Who has access: Anyone |
| Saves work but nothing appears in the Sheet | Editing a different copy of the Sheet | The script only writes to the spreadsheet it lives inside |
| Changed `Code.gs` but nothing changed | Apps Script keeps serving the old version | Deploy ▸ Manage deployments ▸ edit ▸ Version: **New version** ▸ Deploy |
| Page shows the setup box again | Browser data was cleared | Paste the `/exec` URL again |
| Staff see an old ledger | The page pulls on load, not live | Press **↻** |
| Staff PINs don't stick after saving in Admin | The deployed script predates them | Re-paste `Code.gs`, then Deploy ▸ Manage deployments ▸ edit ▸ Version: **New version** |
| A seller sees nothing, or yesterday's day | The script's timezone isn't Bangkok | Apps Script ▸ Project Settings ▸ Time zone = (GMT+07:00) Bangkok |
| Someone is locked out | PIN typo, or they were removed from the list | Check the `staffPins` row in the Config tab |
