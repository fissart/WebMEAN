export default `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>ESFAPA</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://accounts.google.com/gsi/client" async="" defer=""></script>

  <link rel="icon" id="www" type="image/svg+xml"/>
  <meta name="description" content="ESFAPA />
  <link rel=" preconnect"="" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&amp;display=swap" rel="stylesheet">

<script src="https://static.izipay.pe/js/v1/checkout.js"></script>
  <!-- <script src="https://static.izipay.pe/js/v1/checkout.js"></script> -->
  <!-- <script src="https://sandbox-checkout.izipay.pe/payments/v1/js/index.js"></script> -->
  <!-- For Production, use: https://checkout.izipay.pe/payments/v1/js/index.js -->

<link rel="stylesheet" href="styles.css"><link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Black+Ops+One&amp;family=Orbitron:wght@400..900&amp;family=Squada+One&amp;display=swap" as="style"></head>

<body translate="no" ngcm="">
  <app-root></app-root>
<link rel="modulepreload" href="chunk-6CTWA3UM.js"><link rel="modulepreload" href="chunk-YIIFRX4I.js"><link rel="modulepreload" href="chunk-D7R3R2CZ.js"><link rel="modulepreload" href="chunk-P2ICAP4Z.js"><link rel="modulepreload" href="chunk-F5ND45CA.js"><link rel="modulepreload" href="chunk-2Q7FJWIC.js"><link rel="modulepreload" href="chunk-FXWIEX65.js"><link rel="modulepreload" href="chunk-3WPM564S.js"><script src="scripts.js" defer=""></script><script src="main.js" type="module"></script></body>

<script>
  const isTargetHostname = window.location.hostname === "www.esfapa.edu.pe";

  function changeFavicon(newImagePath) {
    let favicon = document.querySelector('link[rel="icon"]') || document.getElementById('www');
    favicon.setAttribute('href', newImagePath);
  }
  if (isTargetHostname) {
    var day = new Date().getDay()
    changeFavicon('/www' + (day + 1) + '.svg')
    document.title = "ESFAPA Ayacucho"
  } else {
    let favicon = document.querySelector('link[rel="icon"]') || document.getElementById('www');
    favicon.setAttribute('href', '/logo.svg');
    document.title = "FISARTH Ayacucho"
  }

  const weeklyFonts = [
    "MilkyVintage-Regular",         // Sunday
    "MilkyVintage-Regular",           // Monday
    "MilkyVintage-Regular",     // Tuesday
    "MilkyVintage-Regular",         // Wednesday
    "MilkyVintage-Regular", // Thursday
    // "HEIDH___-normal",    // Friday
    "MilkyVintage-Regular",    // Friday
    "MilkyVintage-Regular",         // Sunday
    // "Impact"           // Saturday
  ];


  // Get current day index (0 to 6)
  const currentDay = new Date().getDay();

  // Inject the chosen font into your CSS variable
  document.documentElement.style.setProperty('--daily-font', weeklyFonts[currentDay]);

</script>

</html>`;