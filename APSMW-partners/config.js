/* Settings for the APSMW Partners page (consignment partner stores).

   No PIN and no stock data is ever written in this folder — it is on a
   public web address. PINs live in the "Users" tab of the Google Sheet
   "APSMW Partners", and the numbers arrive only after a PIN is accepted.

   apiUrl is the sheet's web app address. It ships with the page so staff are
   only ever asked for a PIN. It is not a key: every call without a PIN the
   sheet recognises gets nothing back, and wrong PINs are answered slowly. */
window.APPEAL_CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbwHnzY0uD7xXB7NAe9T4evJVaJb11HdrPMJKOkTb3dZmyvNJiwYyvKVhV9LDl8v9sT9sw/exec",
  /* minutes of no taps before the page locks and asks for the PIN again */
  idleLockMin: 20
};
