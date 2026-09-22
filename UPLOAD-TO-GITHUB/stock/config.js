/* Settings for the booth stock page.

   There is no PIN in this file and no stock data anywhere in this folder.
   PINs live in the spreadsheet's Config tab (adminPin / staffPins) — the same
   list the booth order page uses — and the numbers arrive from the Sheet after
   someone signs in. This folder is on a public web address, so nothing that
   should stay private is ever written into it.

   To change a PIN: Sheet ▸ Config tab ▸ edit adminPin or staffPins
   (one line per person, "name = pin"). It applies on the next sign-in. */
window.APPEAL_CONFIG = {
  pinHint: "Ask Pia for your PIN · ขอรหัสจากพี่เปีย"
};
