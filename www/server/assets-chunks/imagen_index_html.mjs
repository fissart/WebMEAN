export default `<!DOCTYPE html><html lang="en"><head>
  <meta charset="utf-8">
  <title>ESFAPA</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://accounts.google.com/gsi/client" async="" defer=""></script>

  <link rel="icon" id="www" type="image/svg+xml">
  <meta name="description" content="ESFAPA /&gt;
  &lt;link rel=" preconnect"="" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&amp;display=swap" rel="stylesheet">

<script src="https://static.izipay.pe/js/v1/checkout.js"></script>
  <!-- <script src="https://static.izipay.pe/js/v1/checkout.js"></script> -->
  <!-- <script src="https://sandbox-checkout.izipay.pe/payments/v1/js/index.js"></script> -->
  <!-- For Production, use: https://checkout.izipay.pe/payments/v1/js/index.js -->

<link rel="stylesheet" href="styles.css"><link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&amp;display=swap" as="style"><link rel="preload" href="https://fonts.googleapis.com/css2?family=Black+Ops+One&amp;family=Orbitron:wght@400..900&amp;family=Squada+One&amp;display=swap" as="style"><style ng-app-id="ng">

.canvas-wrapper[_ngcontent-ng-c4158876674] {
  position: relative;
  border-radius: 0.35rem;
  overflow: hidden;
  border: 1px solid #ced4da;
  background-color: #f8f9fa;
  background-image: radial-gradient(#adb5bd 1px, transparent 1px);
  background-size: 16px 16px;
}
.toolbar-title[_ngcontent-ng-c4158876674] {
  font-size: 0.7rem;
  font-weight: 700;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.gap-2[_ngcontent-ng-c4158876674] {
  gap: 8px;
}
.gap-3[_ngcontent-ng-c4158876674] {
  gap: 12px;
}
/*# sourceMappingURL=/editorimg%20copy.css.map */</style><style ng-app-id="ng">

.navbar[_ngcontent-ng-c3327815651] {
  z-index: 12;
  position: absolute;
  width: 100%;
  background: transparent;
  box-shadow: none;
}
.brand-icon[_ngcontent-ng-c3327815651] {
  color: #075b63ff;
  font-size: 34px;
}
.custom-nav-links[_ngcontent-ng-c3327815651]   .nav-link[_ngcontent-ng-c3327815651] {
  color: #075b63ff !important;
}
.custom-nav-links[_ngcontent-ng-c3327815651]   .nav-link[_ngcontent-ng-c3327815651]:hover {
  color: #075b63ff !important;
}
@media (max-width: 991.98px) {
  .navbar-collapse[_ngcontent-ng-c3327815651] {
    position: absolute;
    top: 100%;
    right: 0.5rem;
    min-width: 200px;
  }
  .navbar-collapse.show[_ngcontent-ng-c3327815651] {
    background: rgba(2, 6, 23, 0.90);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    padding: 1.25rem;
    border-radius: 1rem;
    margin-top: 0.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
  }
}
/*# sourceMappingURL=/navbar.css.map */</style></head>

<body translate="no">
  <app-root ng-version="21.0.5" ng-server-context="ssg"><router-outlet></router-outlet><app-fabric-editor _nghost-ng-c4158876674=""><div _ngcontent-ng-c4158876674="" class="bg-white" style="min-height: 100vh;"><app-navbar _ngcontent-ng-c4158876674="" _nghost-ng-c3327815651=""><nav _ngcontent-ng-c3327815651="" class="navbar navbar-expand-lg px-0"><div _ngcontent-ng-c3327815651="" class="container px-2 d-flex justify-content-between align-items-center flex-nowrap position-relative"><a _ngcontent-ng-c3327815651="" routerlink="/" class="navbar-brand" href="/"><i _ngcontent-ng-c3327815651="" class="bi bi-house brand-icon"></i></a><button _ngcontent-ng-c3327815651="" type="button" aria-label="Alternar navegación" class="navbar-toggler border-0 shadow-none" aria-expanded="false"><i _ngcontent-ng-c3327815651="" class="bi bi-list brand-icon"></i></button><div _ngcontent-ng-c3327815651="" class="collapse navbar-collapse flex-grow-0 text-end"><ul _ngcontent-ng-c3327815651="" class="navbar-nav ms-auto mb-2 mb-lg-0 custom-nav-links"><li _ngcontent-ng-c3327815651="" class="nav-item"><a _ngcontent-ng-c3327815651="" routerlink="/documentos" routerlinkactive="active" class="nav-link ffont" href="/documentos"> Documentos </a></li><li _ngcontent-ng-c3327815651="" class="nav-item"><a _ngcontent-ng-c3327815651="" routerlink="/land" routerlinkactive="active" class="nav-link ffont" href="/land"> Vector </a></li><!--container--><li _ngcontent-ng-c3327815651="" class="nav-item"><a _ngcontent-ng-c3327815651="" routerlink="/login" routerlinkactive="active" class="nav-link ffont" href="/login"> Iniciar </a></li><!--container--></ul></div></div></nav></app-navbar><div _ngcontent-ng-c4158876674="" class="py-5"></div><div _ngcontent-ng-c4158876674="" class="container bg-white p-4 rounded shadow-sm border"><div _ngcontent-ng-c4158876674="" class="d-flex flex-wrap align-items-center justify-content-between bg-light p-3 rounded border mb-3 gap-3"><div _ngcontent-ng-c4158876674="" class="d-flex flex-wrap align-items-center gap-2"><span _ngcontent-ng-c4158876674="" class="toolbar-title">Insertar:</span><button _ngcontent-ng-c4158876674="" class="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-square-fill"></i> Rectángulo</button><button _ngcontent-ng-c4158876674="" class="btn btn-success btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-circle-fill"></i> Círculo</button><button _ngcontent-ng-c4158876674="" class="btn btn-warning btn-sm text-white d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-triangle-fill"></i> Triángulo</button><button _ngcontent-ng-c4158876674="" class="btn btn-info btn-sm text-white d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-star-fill"></i> Estrella</button><button _ngcontent-ng-c4158876674="" class="btn btn-secondary btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-dash-lg"></i> Línea</button><button _ngcontent-ng-c4158876674="" class="btn btn-dark btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-type"></i> Texto</button><button _ngcontent-ng-c4158876674="" class="btn btn-danger btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-image"></i> Imagen</button><input _ngcontent-ng-c4158876674="" type="file" accept="image/*" class="d-none"></div><div _ngcontent-ng-c4158876674="" class="d-flex align-items-center gap-3"><div _ngcontent-ng-c4158876674="" class="d-flex align-items-center gap-2"><label _ngcontent-ng-c4158876674="" class="small font-weight-bold text-muted mb-0">Color:</label><input _ngcontent-ng-c4158876674="" type="color" title="Cambiar color" class="form-control form-control-sm p-1" style="width: 34px; height: 32px; cursor: pointer;"></div><!--container--><button _ngcontent-ng-c4158876674="" class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2" title="Pantalla completa"><i _ngcontent-ng-c4158876674="" class="bi bi-fullscreen"></i><span _ngcontent-ng-c4158876674="" class="d-none d-md-inline">Pantalla Completa</span></button></div></div><div _ngcontent-ng-c4158876674="" class="row align-items-start"><div _ngcontent-ng-c4158876674="" class="col d-flex justify-content-center mb-3 mb-md-0"><div _ngcontent-ng-c4158876674="" class="canvas-wrapper shadow-sm"><canvas _ngcontent-ng-c4158876674="" width="720" height="420" data-fabric="main" class="lower-canvas"></canvas></div></div><div _ngcontent-ng-c4158876674="" class="col-auto"><div _ngcontent-ng-c4158876674="" class="d-flex flex-column bg-light p-3 rounded border gap-2" style="width: 165px;"><span _ngcontent-ng-c4158876674="" class="toolbar-title mb-1">Edición</span><button _ngcontent-ng-c4158876674="" class="btn btn-outline-secondary btn-sm text-left d-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-files"></i> Duplicar</button><button _ngcontent-ng-c4158876674="" class="btn btn-outline-secondary btn-sm text-left d-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-arrow-clockwise"></i> Girar 45°</button><button _ngcontent-ng-c4158876674="" class="btn btn-outline-secondary btn-sm text-left d-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-align-center"></i> Centrar H.</button><button _ngcontent-ng-c4158876674="" class="btn btn-outline-secondary btn-sm text-left d-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-lock-fill"></i> Bloquear</button><button _ngcontent-ng-c4158876674="" class="btn btn-outline-secondary btn-sm text-left d-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-layer-forward"></i> Al frente</button><button _ngcontent-ng-c4158876674="" class="btn btn-outline-danger btn-sm text-left d-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-trash3"></i> Borrar</button></div></div></div><div _ngcontent-ng-c4158876674="" class="d-flex flex-wrap align-items-center justify-content-between bg-light p-3 rounded border mt-3 gap-2"><div _ngcontent-ng-c4158876674="" class="d-flex flex-wrap align-items-center gap-2"><span _ngcontent-ng-c4158876674="" class="toolbar-title">Proyecto / Exportación:</span><button _ngcontent-ng-c4158876674="" class="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-file-earmark-image"></i> PNG</button><button _ngcontent-ng-c4158876674="" class="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-filetype-svg"></i> SVG</button><button _ngcontent-ng-c4158876674="" class="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-file-earmark-pdf"></i> PDF</button><button _ngcontent-ng-c4158876674="" class="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-floppy"></i> Guardar</button><button _ngcontent-ng-c4158876674="" class="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2" disabled=""><i _ngcontent-ng-c4158876674="" class="bi bi-folder2-open"></i> Cargar</button></div><button _ngcontent-ng-c4158876674="" class="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-2"><i _ngcontent-ng-c4158876674="" class="bi bi-x-circle"></i> Limpiar Todo</button></div></div></div></app-fabric-editor><!--container--></app-root>
<link rel="modulepreload" href="chunk-6CTWA3UM.js"><link rel="modulepreload" href="chunk-YIIFRX4I.js"><link rel="modulepreload" href="chunk-D7R3R2CZ.js"><link rel="modulepreload" href="chunk-P2ICAP4Z.js"><link rel="modulepreload" href="chunk-F5ND45CA.js"><link rel="modulepreload" href="chunk-2Q7FJWIC.js"><link rel="modulepreload" href="chunk-FXWIEX65.js"><link rel="modulepreload" href="chunk-3WPM564S.js"><script src="scripts.js" defer=""></script><script src="main.js" type="module"></script>
<link rel="modulepreload" href="chunk-3LK2EQQI.js">
<link rel="modulepreload" href="chunk-DGFZVSEJ.js">
<link rel="modulepreload" href="chunk-DJCOHPHY.js">


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

</body></html>`;