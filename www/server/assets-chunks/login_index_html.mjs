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

.form-floating[_ngcontent-ng-c349738908]    > label[_ngcontent-ng-c349738908] {
  padding-left: 2.75rem;
}
.input-icon-wrapper[_ngcontent-ng-c349738908] {
  position: relative;
}
.input-icon[_ngcontent-ng-c349738908] {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  z-index: 5;
  color: #6c757d;
  font-size: 1.15rem;
  transition: color 0.2s ease-in-out;
}
.form-control-icon[_ngcontent-ng-c349738908] {
  padding-left: 2.85rem !important;
}
.input-icon-wrapper[_ngcontent-ng-c349738908]:focus-within   .input-icon[_ngcontent-ng-c349738908] {
  color: #0d6efd;
}
.card-gradient-header[_ngcontent-ng-c349738908] {
  background:
    linear-gradient(
      135deg,
      #0d6efd 0%,
      #0a58ca 100%);
}
.google-btn-wrapper[_ngcontent-ng-c349738908] {
  min-height: 44px;
}
/*# sourceMappingURL=/login.css.map */</style><style ng-app-id="ng">

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
  <app-root ng-version="21.0.5" ng-server-context="ssg"><router-outlet></router-outlet><app-login _nghost-ng-c349738908=""><app-navbar _ngcontent-ng-c349738908="" _nghost-ng-c3327815651=""><nav _ngcontent-ng-c3327815651="" class="navbar navbar-expand-lg px-0"><div _ngcontent-ng-c3327815651="" class="container px-2 d-flex justify-content-between align-items-center flex-nowrap position-relative"><a _ngcontent-ng-c3327815651="" routerlink="/" class="navbar-brand" href="/"><i _ngcontent-ng-c3327815651="" class="bi bi-house brand-icon"></i></a><button _ngcontent-ng-c3327815651="" type="button" aria-label="Alternar navegación" class="navbar-toggler border-0 shadow-none" aria-expanded="false"><i _ngcontent-ng-c3327815651="" class="bi bi-list brand-icon"></i></button><div _ngcontent-ng-c3327815651="" class="collapse navbar-collapse flex-grow-0 text-end"><ul _ngcontent-ng-c3327815651="" class="navbar-nav ms-auto mb-2 mb-lg-0 custom-nav-links"><li _ngcontent-ng-c3327815651="" class="nav-item"><a _ngcontent-ng-c3327815651="" routerlink="/documentos" routerlinkactive="active" class="nav-link ffont" href="/documentos"> Documentos </a></li><li _ngcontent-ng-c3327815651="" class="nav-item"><a _ngcontent-ng-c3327815651="" routerlink="/land" routerlinkactive="active" class="nav-link ffont" href="/land"> Vector </a></li><!--container--><li _ngcontent-ng-c3327815651="" class="nav-item"><a _ngcontent-ng-c3327815651="" routerlink="/login" routerlinkactive="active" class="nav-link ffont active" href="/login"> Iniciar </a></li><!--container--></ul></div></div></nav></app-navbar><div _ngcontent-ng-c349738908="" class="py-4 py-md-5"></div><div _ngcontent-ng-c349738908="" class="container my-4 col-12 col-md-8 col-lg-6 col-xl-5"><div _ngcontent-ng-c349738908="" class="card border-0 shadow-lg rounded-4 overflow-hidden"><div _ngcontent-ng-c349738908="" class="p-2 text-center position-relative"><i _ngcontent-ng-c349738908="" class="bi bi-person-fill-lock fs-2"></i><h4 _ngcontent-ng-c349738908="" class="fw-bold mb-1">Iniciar Sesión</h4><p _ngcontent-ng-c349738908="" class="small mb-0">Ingrese sus credenciales para acceder al sistema</p></div><div _ngcontent-ng-c349738908="" class="card-body p-2 p-md-2"><div _ngcontent-ng-c349738908="" class="text-center mb-2"><p _ngcontent-ng-c349738908="" class="small text-muted mb-2 fw-semibold"><i _ngcontent-ng-c349738908="" class="bi bi-shield-check text-primary me-1"></i> Inicie con Google para mayor seguridad </p><div _ngcontent-ng-c349738908="" class="d-flex justify-content-center google-btn-wrapper"><div _ngcontent-ng-c349738908=""></div></div></div><div _ngcontent-ng-c349738908="" class="d-flex align-items-center text-muted"><hr _ngcontent-ng-c349738908="" class="flex-grow-1 my-0"><span _ngcontent-ng-c349738908="" class="px-2 small text-uppercase fw-semibold text-secondary">o ingrese con correo</span><hr _ngcontent-ng-c349738908="" class="flex-grow-1 my-0"></div><form _ngcontent-ng-c349738908="" novalidate="" class="mt-2 ng-untouched ng-pristine ng-invalid"><div _ngcontent-ng-c349738908="" class="mb-2 input-icon-wrapper"><i _ngcontent-ng-c349738908="" class="bi bi-envelope input-icon"></i><div _ngcontent-ng-c349738908="" class="form-floating"><input _ngcontent-ng-c349738908="" type="email" id="loginEmail" placeholder="correo@ejemplo.com" formcontrolname="email" class="form-control form-control-icon shadow-sm ng-untouched ng-pristine ng-invalid" value=""><label _ngcontent-ng-c349738908="" for="loginEmail" class="text-secondary">Correo Electrónico</label></div></div><div _ngcontent-ng-c349738908="" class="mb-2 input-icon-wrapper"><i _ngcontent-ng-c349738908="" class="bi bi-key input-icon"></i><div _ngcontent-ng-c349738908="" class="form-floating"><input _ngcontent-ng-c349738908="" type="password" id="loginPassword" placeholder="Contraseña" formcontrolname="password" class="form-control form-control-icon shadow-sm ng-untouched ng-pristine ng-invalid" value=""><label _ngcontent-ng-c349738908="" for="loginPassword" class="text-secondary">Contraseña</label></div></div><button _ngcontent-ng-c349738908="" type="submit" class="btn btn-primary text-uppercase fw-bold shadow-sm py-1 mt-2 w-100 d-flex align-items-center justify-content-center gap-1"><!--container--><i _ngcontent-ng-c349738908="" class="bi bi-box-arrow-in-right fs-5"></i><span _ngcontent-ng-c349738908="">Iniciar sesión</span><!--container--></button><div _ngcontent-ng-c349738908="" class="text-center mt-1"><a _ngcontent-ng-c349738908="" routerlink="/users/password/forget" class="text-decoration-none small text-muted hover-underline" href="/users/password/forget"><i _ngcontent-ng-c349738908="" class="bi bi-question-circle me-1"></i> ¿Olvidaste tu contraseña? </a></div></form></div></div></div></app-login><!--container--></app-root>
<link rel="modulepreload" href="chunk-6CTWA3UM.js"><link rel="modulepreload" href="chunk-YIIFRX4I.js"><link rel="modulepreload" href="chunk-D7R3R2CZ.js"><link rel="modulepreload" href="chunk-P2ICAP4Z.js"><link rel="modulepreload" href="chunk-F5ND45CA.js"><link rel="modulepreload" href="chunk-2Q7FJWIC.js"><link rel="modulepreload" href="chunk-FXWIEX65.js"><link rel="modulepreload" href="chunk-3WPM564S.js"><script src="scripts.js" defer=""></script><script src="main.js" type="module"></script>
<link rel="modulepreload" href="chunk-HDSPNLIS.js">
<link rel="modulepreload" href="chunk-DVLMTEHO.js">
<link rel="modulepreload" href="chunk-5ESGTH3B.js">
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