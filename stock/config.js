/* Settings for the booth stock page.

   There is no PIN in this file and no stock data anywhere in this folder.
   PINs live in the spreadsheet's Config tab (adminPin / staffPins) — the same
   list the booth order page uses — and the numbers arrive from the Sheet after
   someone signs in. This folder is on a public web address, so nothing that
   should stay private is ever written into it.

   To change a PIN: Sheet ▸ Config tab ▸ edit adminPin or staffPins
   (one line per person, "name = pin"). It applies on the next sign-in. */
window.APPEAL_CONFIG = {
  /* Blank hides the line under the PIN box. Put a sentence here if you ever
     want one back. */
  pinHint: "",

  /* The sheet's web app address. It ships with the page so the plain link
     works on any device, anywhere, and the only thing ever asked for is a PIN.

     This is deliberately public and it is not a key. Every call to it is
     refused without a PIN the sheet recognises, the reply carries nothing
     until one is, and the sheet slows down wrong PINs so guessing at it is
     hopeless. The PIN is the thing that protects the stock — keep every PIN
     six digits, and change them in ตั้งค่า on the page, never in this file. */
  apiUrl: "https://script.google.com/macros/s/AKfycbwODucxbNL6l2GngosqoU_mHUA2Dq9Cy79h-M2xTvSxjYbkyQXq6znNejpAZFrRwJIB/exec"
};
