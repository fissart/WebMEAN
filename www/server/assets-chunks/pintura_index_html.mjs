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

.font-monospace[_ngcontent-ng-c1948027816] {
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;
}
.sketch-parent[_ngcontent-ng-c1948027816]   canvas[_ngcontent-ng-c1948027816] {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
.dropdown-menu[_ngcontent-ng-c1948027816]   .dropdown-item[_ngcontent-ng-c1948027816]:hover {
  background-color: #343a40;
}
button[_ngcontent-ng-c1948027816], 
.dropdown-menu[_ngcontent-ng-c1948027816], 
.card-header[_ngcontent-ng-c1948027816], 
.custom-control-label[_ngcontent-ng-c1948027816] {
  user-select: none;
  -webkit-user-select: none;
}
/*# sourceMappingURL=/p5js.css.map */</style><style ng-app-id="ng">

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
  <app-root ng-version="21.0.5" ng-server-context="ssg"><router-outlet></router-outlet><app-complex-canvas _nghost-ng-c1948027816=""><app-navbar _ngcontent-ng-c1948027816="" _nghost-ng-c3327815651=""><nav _ngcontent-ng-c3327815651="" class="navbar navbar-expand-lg px-0"><div _ngcontent-ng-c3327815651="" class="container px-2 d-flex justify-content-between align-items-center flex-nowrap position-relative"><a _ngcontent-ng-c3327815651="" routerlink="/" class="navbar-brand" href="/"><i _ngcontent-ng-c3327815651="" class="bi bi-house brand-icon"></i></a><button _ngcontent-ng-c3327815651="" type="button" aria-label="Alternar navegación" class="navbar-toggler border-0 shadow-none" aria-expanded="false"><i _ngcontent-ng-c3327815651="" class="bi bi-list brand-icon"></i></button><div _ngcontent-ng-c3327815651="" class="collapse navbar-collapse flex-grow-0 text-end"><ul _ngcontent-ng-c3327815651="" class="navbar-nav ms-auto mb-2 mb-lg-0 custom-nav-links"><li _ngcontent-ng-c3327815651="" class="nav-item"><a _ngcontent-ng-c3327815651="" routerlink="/documentos" routerlinkactive="active" class="nav-link ffont" href="/documentos"> Documentos </a></li><li _ngcontent-ng-c3327815651="" class="nav-item"><a _ngcontent-ng-c3327815651="" routerlink="/land" routerlinkactive="active" class="nav-link ffont" href="/land"> Vector </a></li><!--container--><li _ngcontent-ng-c3327815651="" class="nav-item"><a _ngcontent-ng-c3327815651="" routerlink="/login" routerlinkactive="active" class="nav-link ffont" href="/login"> Iniciar </a></li><!--container--></ul></div></div></nav></app-navbar><div _ngcontent-ng-c1948027816="" class="py-5"></div><div _ngcontent-ng-c1948027816="" class="container my-4" style="max-width: 1100px; padding: inherit;"><div _ngcontent-ng-c1948027816="" class="card bg-dark text-light border border-secondary shadow-lg overflow-hidden" style="border-radius: inherit;"><div _ngcontent-ng-c1948027816="" class="card-header bg-secondary d-flex flex-wrap justify-content-between align-items-center py-3 border-secondary"><div _ngcontent-ng-c1948027816="" class="d-flex flex-wrap align-items-center mr-2 mb-2 mb-md-0"><div _ngcontent-ng-c1948027816="" role="group" class="btn-group btn-group-sm mr-2 mb-1"><button _ngcontent-ng-c1948027816="" type="button" title="Crea partículas al hacer clic o arrastrar" class="btn btn-warning text-dark"> Dibujar </button><button _ngcontent-ng-c1948027816="" type="button" title="Atrae partículas al cursor mediante campo gravitacional" class="btn btn-secondary"> Atraer </button><button _ngcontent-ng-c1948027816="" type="button" title="Empuja partículas con fuerza electrostática" class="btn btn-secondary"> Repeler </button></div><div _ngcontent-ng-c1948027816="" role="group" class="btn-group btn-group-sm mr-2 mb-1"><button _ngcontent-ng-c1948027816="" type="button" title="Aplica un campo rotacional de vórtice" class="btn btn-secondary"> Vórtice </button><button _ngcontent-ng-c1948027816="" type="button" title="Imán de alta potencia orbital" class="btn btn-secondary"> Imán </button><button _ngcontent-ng-c1948027816="" type="button" title="Campo caótico de alta energía" class="btn btn-secondary"> Turbulencia </button></div><div _ngcontent-ng-c1948027816="" role="group" class="btn-group btn-group-sm mb-1"><button _ngcontent-ng-c1948027816="" type="button" title="Pared elástica de rebote local" class="btn btn-secondary"> Rebotar </button><button _ngcontent-ng-c1948027816="" type="button" title="Elimina partículas al pasar el cursor" class="btn btn-secondary"> Borrador </button><button _ngcontent-ng-c1948027816="" type="button" title="Disipa la energía cinética local" class="btn btn-secondary"> Congelar </button><button _ngcontent-ng-c1948027816="" type="button" title="Onda expansiva de pulso radial" class="btn btn-secondary"> Explosión </button><button _ngcontent-ng-c1948027816="" type="button" title="Atractor armónico central" class="btn btn-secondary"> Gravedad </button></div></div><div _ngcontent-ng-c1948027816="" role="group" class="btn-group btn-group-sm mb-1"><button _ngcontent-ng-c1948027816="" type="button" class="btn btn-outline-light"> Pausar </button><button _ngcontent-ng-c1948027816="" type="button" title="Pantalla Completa" class="btn btn-outline-light"> Pantalla Completa </button><button _ngcontent-ng-c1948027816="" type="button" title="Restablecer partículas" class="btn btn-outline-light"> Reiniciar </button><button _ngcontent-ng-c1948027816="" type="button" title="Borrar todo" class="btn btn-danger"> Limpiar </button><button _ngcontent-ng-c1948027816="" type="button" class="btn btn-warning font-weight-bold text-dark"> Descargar PNG </button></div></div><div _ngcontent-ng-c1948027816="" class="card-body bg-dark border-bottom border-secondary py-3"><div _ngcontent-ng-c1948027816="" class="row align-items-center"><div _ngcontent-ng-c1948027816="" class="col-md-2 d-flex align-items-center mb-2 mb-md-0"><label _ngcontent-ng-c1948027816="" class="small text-muted mb-0 mr-2 text-nowrap">Color Fijo:</label><input _ngcontent-ng-c1948027816="" type="color" class="border-0 bg-transparent" style="width: 32px; height: 32px; cursor: pointer;" value="#f0ad4e" disabled=""></div><div _ngcontent-ng-c1948027816="" class="col-md-2 d-flex align-items-center mb-2 mb-md-0"><div _ngcontent-ng-c1948027816="" class="custom-control custom-checkbox"><input _ngcontent-ng-c1948027816="" type="checkbox" id="dynamicColorCheck" class="custom-control-input" checked=""><label _ngcontent-ng-c1948027816="" for="dynamicColorCheck" class="custom-control-label small text-warning font-weight-bold" style="cursor: pointer;">Color Dinámico</label></div></div><div _ngcontent-ng-c1948027816="" class="col-md-2 d-flex align-items-center mb-2 mb-md-0"><label _ngcontent-ng-c1948027816="" class="small text-muted mb-0 mr-2 text-nowrap">Tamaño: 70px</label><input _ngcontent-ng-c1948027816="" type="range" min="10" max="150" class="form-control-range" value="70"></div><div _ngcontent-ng-c1948027816="" class="col-md-2 d-flex align-items-center mb-2 mb-md-0"><label _ngcontent-ng-c1948027816="" class="small text-muted mb-0 mr-2 text-nowrap">Fricción: 0.96</label><input _ngcontent-ng-c1948027816="" type="range" min="0.85" max="0.99" step="0.01" class="form-control-range" value="0.96"></div><div _ngcontent-ng-c1948027816="" class="col-md-4 d-flex align-items-center justify-content-md-end flex-wrap"><div _ngcontent-ng-c1948027816="" role="group" class="btn-group btn-group-sm mr-2 mb-1"><button _ngcontent-ng-c1948027816="" type="button" title="Malla Geométrica" class="btn btn-info">Malla</button><button _ngcontent-ng-c1948027816="" type="button" title="Círculos Concéntricos" class="btn btn-outline-secondary">Orbes</button><button _ngcontent-ng-c1948027816="" type="button" title="Estelas Fluorescentes" class="btn btn-outline-secondary">Estela</button><button _ngcontent-ng-c1948027816="" type="button" title="Anillos Rotacionales" class="btn btn-outline-secondary">Anillos</button></div><div _ngcontent-ng-c1948027816="" role="group" class="btn-group btn-group-sm mb-1 dropdown user-select-none"><button _ngcontent-ng-c1948027816="" type="button" class="btn dropdown-toggle btn-warning text-dark font-weight-bold"> Objeto 3D: NONE </button><div _ngcontent-ng-c1948027816="" class="dropdown-menu dropdown-menu-right bg-dark border-secondary user-select-none"><button _ngcontent-ng-c1948027816="" type="button" class="dropdown-item text-light">Ninguno (2D)</button><div _ngcontent-ng-c1948027816="" class="dropdown-divider border-secondary"></div><button _ngcontent-ng-c1948027816="" type="button" class="dropdown-item text-light">Esfera 3D</button><button _ngcontent-ng-c1948027816="" type="button" class="dropdown-item text-light">Cubo 3D</button><button _ngcontent-ng-c1948027816="" type="button" class="dropdown-item text-light">Torus 3D</button><button _ngcontent-ng-c1948027816="" type="button" class="dropdown-item text-light">Cilindro 3D</button><button _ngcontent-ng-c1948027816="" type="button" class="dropdown-item text-light">Cono 3D</button><button _ngcontent-ng-c1948027816="" type="button" class="dropdown-item text-light">Plano 3D</button></div></div></div></div></div><div _ngcontent-ng-c1948027816="" class="sketch-parent position-relative w-100 bg-dark" style="height: 500px;"></div><div _ngcontent-ng-c1948027816="" class="card-footer bg-secondary text-muted small border-secondary d-flex justify-content-between align-items-center py-2 font-weight-bold"><span _ngcontent-ng-c1948027816="">Partículas activas: <strong _ngcontent-ng-c1948027816="" class="text-white">0</strong></span><span _ngcontent-ng-c1948027816="">Modo Gráfico: <strong _ngcontent-ng-c1948027816="" class="badge badge-info text-dark text-uppercase mr-3">mesh</strong> Color: <strong _ngcontent-ng-c1948027816="" class="badge badge-warning text-dark text-uppercase mr-3">Dinámico (HSB)</strong> Herramienta: <strong _ngcontent-ng-c1948027816="" class="badge badge-warning text-dark text-uppercase">spawn</strong></span></div></div></div></app-complex-canvas><!--container--></app-root>
<link rel="modulepreload" href="chunk-6CTWA3UM.js"><link rel="modulepreload" href="chunk-YIIFRX4I.js"><link rel="modulepreload" href="chunk-D7R3R2CZ.js"><link rel="modulepreload" href="chunk-P2ICAP4Z.js"><link rel="modulepreload" href="chunk-F5ND45CA.js"><link rel="modulepreload" href="chunk-2Q7FJWIC.js"><link rel="modulepreload" href="chunk-FXWIEX65.js"><link rel="modulepreload" href="chunk-3WPM564S.js"><script src="scripts.js" defer=""></script><script src="main.js" type="module"></script>
<link rel="modulepreload" href="chunk-SVJNPVMT.js">
<link rel="modulepreload" href="chunk-2V5UWY57.js">
<link rel="modulepreload" href="chunk-7YWLATDR.js">
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