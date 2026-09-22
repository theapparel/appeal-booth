/* Settings for the booth stock page.

   There is no PIN in this file and no stock data anywhere in this folder.
   PINs live in the spreadsheet's Config tab (adminPin / staffPins) — the same
   list the booth order page uses — and the numbers arrive from the Sheet after
   someone signs in. This folder is on a public web address, so nothing that
   should stay private is ever written into it.

   To change a PIN: Sheet ▸ Config tab ▸ edit adminPin or staffPins
   (one line per person, "name = pin"). It applies on the next sign-in. */
window.APPEAL_CONFIG = {
  pinHint: "Ask Pia for your PIN \u00b7 \u0e02\u0e2d\u0e23\u0e2b\u0e31\u0e2a\u0e08\u0e32\u0e01\u0e1e\u0e35\u0e48\u0e40\u0e1b\u0e35\u0e22"
};
