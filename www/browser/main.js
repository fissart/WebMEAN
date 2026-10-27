import {
  provideToastr
} from "./chunk-6CTWA3UM.js";
import {
  src_default
} from "./chunk-YIIFRX4I.js";
import {
  KATEX_OPTIONS,
  f,
  provideMarkdown
} from "./chunk-D7R3R2CZ.js";
import {
  DomRendererFactory2,
  PreloadAllModules,
  RouterOutlet,
  bootstrapApplication,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions
} from "./chunk-P2ICAP4Z.js";
import {
  provideHttpClient
} from "./chunk-F5ND45CA.js";
import {
  registerLocaleData
} from "./chunk-2Q7FJWIC.js";
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionScheduler,
  Component,
  DOCUMENT,
  Injectable,
  InjectionToken,
  Injector,
  LOCALE_ID,
  NgZone,
  RendererFactory2,
  RuntimeError,
  inject,
  makeEnvironmentProviders,
  performanceMarkFeature,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵinvalidFactory
} from "./chunk-FXWIEX65.js";
import {
  __spreadValues
} from "./chunk-3WPM564S.js";

// node_modules/@angular/platform-browser/fesm2022/animations-async.mjs
var ANIMATION_PREFIX = "@";
var AsyncAnimationRendererFactory = class _AsyncAnimationRendererFactory {
  doc;
  delegate;
  zone;
  animationType;
  moduleImpl;
  _rendererFactoryPromise = null;
  scheduler = null;
  injector = inject(Injector);
  loadingSchedulerFn = inject(\u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN, {
    optional: true
  });
  _engine;
  constructor(doc, delegate, zone, animationType, moduleImpl) {
    this.doc = doc;
    this.delegate = delegate;
    this.zone = zone;
    this.animationType = animationType;
    this.moduleImpl = moduleImpl;
  }
  ngOnDestroy() {
    this._engine?.flush();
  }
  loadImpl() {
    const loadFn = () => this.moduleImpl ?? import("./chunk-EHRWHACX.js").then((m) => m);
    let moduleImplPromise;
    if (this.loadingSchedulerFn) {
      moduleImplPromise = this.loadingSchedulerFn(loadFn);
    } else {
      moduleImplPromise = loadFn();
    }
    return moduleImplPromise.catch((e) => {
      throw new RuntimeError(5300, (typeof ngDevMode === "undefined" || ngDevMode) && "Async loading for animations package was enabled, but loading failed. Angular falls back to using regular rendering. No animations will be displayed and their styles won't be applied.");
    }).then(({
      \u0275createEngine,
      \u0275AnimationRendererFactory
    }) => {
      this._engine = \u0275createEngine(this.animationType, this.doc);
      const rendererFactory = new \u0275AnimationRendererFactory(this.delegate, this._engine, this.zone);
      this.delegate = rendererFactory;
      return rendererFactory;
    });
  }
  createRenderer(hostElement, rendererType) {
    const renderer = this.delegate.createRenderer(hostElement, rendererType);
    if (renderer.\u0275type === 0) {
      return renderer;
    }
    if (typeof renderer.throwOnSyntheticProps === "boolean") {
      renderer.throwOnSyntheticProps = false;
    }
    const dynamicRenderer = new DynamicDelegationRenderer(renderer);
    if (rendererType?.data?.["animation"] && !this._rendererFactoryPromise) {
      this._rendererFactoryPromise = this.loadImpl();
    }
    this._rendererFactoryPromise?.then((animationRendererFactory) => {
      const animationRenderer = animationRendererFactory.createRenderer(hostElement, rendererType);
      dynamicRenderer.use(animationRenderer);
      this.scheduler ??= this.injector.get(ChangeDetectionScheduler, null, {
        optional: true
      });
      this.scheduler?.notify(10);
    }).catch((e) => {
      dynamicRenderer.use(renderer);
    });
    return dynamicRenderer;
  }
  begin() {
    this.delegate.begin?.();
  }
  end() {
    this.delegate.end?.();
  }
  whenRenderingDone() {
    return this.delegate.whenRenderingDone?.() ?? Promise.resolve();
  }
  componentReplaced(componentId) {
    this._engine?.flush();
    this.delegate.componentReplaced?.(componentId);
  }
  static \u0275fac = function AsyncAnimationRendererFactory_Factory(__ngFactoryType__) {
    \u0275\u0275invalidFactory();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _AsyncAnimationRendererFactory,
    factory: _AsyncAnimationRendererFactory.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AsyncAnimationRendererFactory, [{
    type: Injectable
  }], () => [{
    type: Document
  }, {
    type: RendererFactory2
  }, {
    type: NgZone
  }, {
    type: void 0
  }, {
    type: Promise
  }], null);
})();
var DynamicDelegationRenderer = class {
  delegate;
  replay = [];
  \u0275type = 1;
  constructor(delegate) {
    this.delegate = delegate;
  }
  use(impl) {
    this.delegate = impl;
    if (this.replay !== null) {
      for (const fn of this.replay) {
        fn(impl);
      }
      this.replay = null;
    }
  }
  get data() {
    return this.delegate.data;
  }
  destroy() {
    this.replay = null;
    this.delegate.destroy();
  }
  createElement(name, namespace) {
    return this.delegate.createElement(name, namespace);
  }
  createComment(value) {
    return this.delegate.createComment(value);
  }
  createText(value) {
    return this.delegate.createText(value);
  }
  get destroyNode() {
    return this.delegate.destroyNode;
  }
  appendChild(parent, newChild) {
    this.delegate.appendChild(parent, newChild);
  }
  insertBefore(parent, newChild, refChild, isMove) {
    this.delegate.insertBefore(parent, newChild, refChild, isMove);
  }
  removeChild(parent, oldChild, isHostElement, requireSynchronousElementRemoval) {
    this.delegate.removeChild(parent, oldChild, isHostElement, requireSynchronousElementRemoval);
  }
  selectRootElement(selectorOrNode, preserveContent) {
    return this.delegate.selectRootElement(selectorOrNode, preserveContent);
  }
  parentNode(node) {
    return this.delegate.parentNode(node);
  }
  nextSibling(node) {
    return this.delegate.nextSibling(node);
  }
  setAttribute(el, name, value, namespace) {
    this.delegate.setAttribute(el, name, value, namespace);
  }
  removeAttribute(el, name, namespace) {
    this.delegate.removeAttribute(el, name, namespace);
  }
  addClass(el, name) {
    this.delegate.addClass(el, name);
  }
  removeClass(el, name) {
    this.delegate.removeClass(el, name);
  }
  setStyle(el, style, value, flags) {
    this.delegate.setStyle(el, style, value, flags);
  }
  removeStyle(el, style, flags) {
    this.delegate.removeStyle(el, style, flags);
  }
  setProperty(el, name, value) {
    if (this.shouldReplay(name)) {
      this.replay.push((renderer) => renderer.setProperty(el, name, value));
    }
    this.delegate.setProperty(el, name, value);
  }
  setValue(node, value) {
    this.delegate.setValue(node, value);
  }
  listen(target, eventName, callback, options) {
    if (this.shouldReplay(eventName)) {
      this.replay.push((renderer) => renderer.listen(target, eventName, callback, options));
    }
    return this.delegate.listen(target, eventName, callback, options);
  }
  shouldReplay(propOrEventName) {
    return this.replay !== null && propOrEventName.startsWith(ANIMATION_PREFIX);
  }
};
var \u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "async_animation_loading_scheduler_fn" : "");
function provideAnimationsAsync(type = "animations") {
  performanceMarkFeature("NgAsyncAnimations");
  if (false) {
    type = "noop";
  }
  return makeEnvironmentProviders([{
    provide: RendererFactory2,
    useFactory: () => {
      return new AsyncAnimationRendererFactory(inject(DOCUMENT), inject(DomRendererFactory2), inject(NgZone), type);
    }
  }, {
    provide: ANIMATION_MODULE_TYPE,
    useValue: type === "noop" ? "NoopAnimations" : "BrowserAnimations"
  }]);
}

// node_modules/@angular/common/locales/es.js
var u = void 0;
function plural(val) {
  const n = val, i = Math.floor(Math.abs(val)), v = val.toString().replace(/^[^.]*\.?/, "").length, e = parseInt(val.toString().replace(/^[^e]*(e([-+]?\d+))?/, "$2")) || 0;
  if (n === 1)
    return 1;
  if (e === 0 && (!(i === 0) && (i % 1e6 === 0 && v === 0)) || !(e >= 0 && e <= 5))
    return 4;
  return 5;
}
var es_default = ["es", [["a.\u202Fm.", "p.\u202Fm."], u, ["a.\xA0m.", "p.\xA0m."]], u, [["D", "L", "M", "X", "J", "V", "S"], ["dom", "lun", "mar", "mi\xE9", "jue", "vie", "s\xE1b"], ["domingo", "lunes", "martes", "mi\xE9rcoles", "jueves", "viernes", "s\xE1bado"], ["DO", "LU", "MA", "MI", "JU", "VI", "SA"]], u, [["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"], ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]], u, [["a. C.", "d. C."], u, ["antes de Cristo", "despu\xE9s de Cristo"]], 1, [6, 0], ["d/M/yy", "d MMM y", "d 'de' MMMM 'de' y", "EEEE, d 'de' MMMM 'de' y"], ["H:mm", "H:mm:ss", "H:mm:ss z", "H:mm:ss (zzzz)"], ["{1}, {0}", u, u, u], [",", ".", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"], ["#,##0.###", "#,##0\xA0%", "#,##0.00\xA0\xA4", "#E0"], "EUR", "\u20AC", "euro", { "AUD": [u, "$"], "BRL": [u, "R$"], "BYN": [u, "\u0440."], "CAD": [u, "$"], "CNY": [u, "\xA5"], "EGP": [u, "EGP"], "ESP": ["\u20A7"], "GBP": [u, "\xA3"], "HKD": [u, "$"], "ILS": [u, "\u20AA"], "INR": [u, "\u20B9"], "JPY": [u, "\xA5"], "KRW": [u, "\u20A9"], "MXN": [u, "$"], "NZD": [u, "$"], "PHP": [u, "\u20B1"], "RON": [u, "L"], "THB": ["\u0E3F"], "TWD": [u, "NT$"], "USD": ["US$", "$"], "XAF": [], "XCD": [u, "$"], "XOF": [] }, "ltr", plural];

// src/app/app.routes.ts
var routes = [
  __spreadValues({
    path: "",
    loadComponent: () => import("./chunk-JEYOBWCK.js").then((m) => m.InicioComponent),
    pathMatch: "full"
  }, false ? { \u0275entryName: "src/app/componentes/inicio.ts" } : {}),
  __spreadValues({
    path: "land",
    loadComponent: () => import("./chunk-LAKWRPDQ.js").then((m) => m.ChildScene)
  }, false ? { \u0275entryName: "src/app/componentes/vector.ts" } : {}),
  __spreadValues({
    path: "tramite",
    loadComponent: () => import("./chunk-ROJ4NOGZ.js").then((m) => m.CreateNoteComponent)
  }, false ? { \u0275entryName: "src/app/componentes/tramite.ts" } : {}),
  __spreadValues({
    path: "socket",
    loadComponent: () => import("./chunk-VBN6QGTQ.js").then((m) => m.AdminComponent)
  }, false ? { \u0275entryName: "src/app/componentes/chat.ts" } : {}),
  __spreadValues({
    path: "latex",
    loadComponent: () => import("./chunk-HFT4L6K6.js").then((m) => m.CreateNoteComponent)
  }, false ? { \u0275entryName: "src/app/componentes/latexedit.ts" } : {}),
  __spreadValues({
    path: "articulo",
    loadComponent: () => import("./chunk-7YOI5QSG.js").then((m) => m.ScientificArticlesManagerComponent)
  }, false ? { \u0275entryName: "src/app/componentes/articulos.ts" } : {}),
  __spreadValues({
    path: "actualizacion/:id",
    loadComponent: () => import("./chunk-Z73DSWNG.js").then((m) => m.CreateNoteComponent)
  }, false ? { \u0275entryName: "src/app/componentes/actualizacion.ts" } : {}),
  __spreadValues({
    path: "courses",
    loadComponent: () => import("./chunk-IG3FX36P.js").then((m) => m.CreateNoteComponent)
  }, false ? { \u0275entryName: "src/app/componentes/curses.ts" } : {}),
  __spreadValues({
    path: "tema/:idcurso/:idtema",
    loadComponent: () => import("./chunk-TX5HYFOX.js").then((m) => m.ThemeComponent)
  }, false ? { \u0275entryName: "src/app/componentes/actualizaciontheme.ts" } : {}),
  __spreadValues({
    path: "updatetest/:idtest",
    loadComponent: () => import("./chunk-NNBPA3NY.js").then((m) => m.TestsComponent)
  }, false ? { \u0275entryName: "src/app/componentes/actualizacionupdatetest.ts" } : {}),
  __spreadValues({
    path: "tematest/:curseid/:themeid",
    loadComponent: () => import("./chunk-UJG6JQJH.js").then((m) => m.ExportToExcelComponent)
  }, false ? { \u0275entryName: "src/app/componentes/actualizaciontest.ts" } : {}),
  __spreadValues({
    path: "newmodel",
    loadComponent: () => import("./chunk-UFXKMWN5.js").then((m) => m.ThreeHtmlCanvasComponent)
  }, false ? { \u0275entryName: "src/app/componentes/logomodel3d.ts" } : {}),
  __spreadValues({
    path: "model/:id/:email",
    loadComponent: () => import("./chunk-CSVV5NM4.js").then((m) => m.AppComponent)
  }, false ? { \u0275entryName: "src/app/componentes/model3d.ts" } : {}),
  __spreadValues({
    path: "carreras",
    loadComponent: () => import("./chunk-UQIFTFS2.js").then((m) => m.PlyViewerComponent)
  }, false ? { \u0275entryName: "src/app/componentes/carreras.ts" } : {}),
  __spreadValues({
    path: "video/:code",
    loadComponent: () => import("./chunk-MUOODWJR.js").then((m) => m.VideoComponent)
  }, false ? { \u0275entryName: "src/app/componentes/video.ts" } : {}),
  __spreadValues({
    path: "panel",
    loadComponent: () => import("./chunk-ATVJCDWM.js").then((m) => m.CreateNoteComponent)
  }, false ? { \u0275entryName: "src/app/componentes/panel.ts" } : {}),
  __spreadValues({
    path: "bot",
    loadComponent: () => import("./chunk-M2XFJO3N.js").then((m) => m.BotDashboardComponent)
  }, false ? { \u0275entryName: "src/app/componentes/botfather.ts" } : {}),
  __spreadValues({
    path: "adicionarusuario",
    loadComponent: () => import("./chunk-Y3BGZ64S.js").then((m) => m.UserFormComponent)
  }, false ? { \u0275entryName: "src/app/componentes/useradd.ts" } : {}),
  __spreadValues({
    path: "actualizarusuario",
    loadComponent: () => import("./chunk-YEV7HBR4.js").then((m) => m.PrivateComponent)
  }, false ? { \u0275entryName: "src/app/componentes/userupdate.ts" } : {}),
  __spreadValues({
    path: "game",
    loadComponent: () => import("./chunk-QK3454ZN.js").then((m) => m.FpsGameComponent)
  }, false ? { \u0275entryName: "src/app/componentes/player.ts" } : {}),
  __spreadValues({
    path: "imagen2",
    loadComponent: () => import("./chunk-DYWROQM2.js").then((m) => m.ContenedorIframeComponent)
  }, false ? { \u0275entryName: "src/app/componentes/editorimg.ts" } : {}),
  __spreadValues({
    path: "imagen",
    loadComponent: () => import("./chunk-3LK2EQQI.js").then((m) => m.FabricEditorComponent)
  }, false ? { \u0275entryName: "src/app/componentes/editorimg copy.ts" } : {}),
  __spreadValues({
    path: "blender",
    loadComponent: () => import("./chunk-B2G5Q7HA.js").then((m) => m.ModelBoradForm)
  }, false ? { \u0275entryName: "src/app/componentes/editorimg copy 2.ts" } : {}),
  __spreadValues({
    path: "pintura",
    loadComponent: () => import("./chunk-SVJNPVMT.js").then((m) => m.ComplexCanvasComponent)
  }, false ? { \u0275entryName: "src/app/componentes/p5js.ts" } : {}),
  __spreadValues({
    path: "statistic",
    loadComponent: () => import("./chunk-QMCZWVEP.js").then((m) => m.SurveyDashboardComponent)
  }, false ? { \u0275entryName: "src/app/componentes/d3js.ts" } : {}),
  __spreadValues({
    path: "sculpt",
    loadComponent: () => import("./chunk-KVX5WVLG.js").then((m) => m.MeshSculptorComponent)
  }, false ? { \u0275entryName: "src/app/componentes/sculpt.ts" } : {}),
  __spreadValues({
    path: "audio",
    loadComponent: () => import("./chunk-WZEZOMAR.js").then((m) => m.MultiTrackAudioPlayerComponent)
  }, false ? { \u0275entryName: "src/app/componentes/audio.ts" } : {}),
  __spreadValues({
    path: "acerca",
    loadComponent: () => import("./chunk-OZK2UM33.js").then((m) => m.Acerca)
  }, false ? { \u0275entryName: "src/app/componentes/acerca.ts" } : {}),
  __spreadValues({
    path: "exhibicion",
    loadComponent: () => import("./chunk-KNBEU7IU.js").then((m) => m.VirtualMuseumComponent)
  }, false ? { \u0275entryName: "src/app/componentes/exhibicion.ts" } : {}),
  __spreadValues({
    path: "exhibicion/:id/:user",
    loadComponent: () => import("./chunk-W5IUZCTA.js").then((m) => m.ArtCuratorshipComponent)
  }, false ? { \u0275entryName: "src/app/componentes/exhibicionfiles.ts" } : {}),
  __spreadValues({
    path: "documentos",
    loadComponent: () => import("./chunk-THFBRKRP.js").then((m) => m.AdminDashboardComponent)
  }, false ? { \u0275entryName: "src/app/componentes/documents.ts" } : {}),
  __spreadValues({
    path: "login",
    loadComponent: () => import("./chunk-HDSPNLIS.js").then((m) => m.LoginComponent)
  }, false ? { \u0275entryName: "src/app/componentes/login.ts" } : {}),
  __spreadValues({
    path: "stats",
    loadComponent: () => import("./chunk-EY2ELMGC.js").then((m) => m.SStats)
  }, false ? { \u0275entryName: "src/app/componentes/statbegin.ts" } : {}),
  __spreadValues({
    path: "blog",
    loadComponent: () => import("./chunk-626CWFQB.js").then((m) => m.ForumComponent)
  }, false ? { \u0275entryName: "src/app/componentes/blogger.ts" } : {}),
  __spreadValues({
    path: "statest/:tipo/:email",
    loadComponent: () => import("./chunk-USU3GMX7.js").then((m) => m.TestsComponent)
  }, false ? { \u0275entryName: "src/app/componentes/substats.ts" } : {}),
  // Redirección para rutas no encontradas
  {
    path: "**",
    redirectTo: ""
  }
];

// src/app/app.config.ts
registerLocaleData(es_default, "es");
f.use(src_default({
  throwOnError: false
}));
var appConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withPreloading(PreloadAllModules)),
    // 3. Proveer el LOCALE_ID globalmente para toda la aplicación
    { provide: LOCALE_ID, useValue: "es" },
    provideHttpClient(),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 1500,
      positionClass: "toast-top-right",
      preventDuplicates: true
    }),
    provideMarkdown({
      // sanitize: {
      //   provide: SANITIZE,
      //   useValue: SecurityContext.HTML
      // },
      katexOptions: {
        provide: KATEX_OPTIONS,
        useValue: {
          displayMode: true,
          errorColor: "#cc0000"
        }
      }
    })
  ]
};

// src/app/app.ts
var App = class _App {
  title = signal("WebMEAN", ...ngDevMode ? [{ debugName: "title" }] : []);
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 1, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", imports: [RouterOutlet], template: "\n\n\n<router-outlet />\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 10 });
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
/*! Bundled license information:

@angular/platform-browser/fesm2022/animations-async.mjs:
  (**
   * @license Angular v21.0.5
   * (c) 2010-2025 Google LLC. https://angular.dev/
   * License: MIT
   *)

@angular/common/locales/es.js:
  (**
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.dev/license
   *)
*/
//# sourceMappingURL=main.js.map
