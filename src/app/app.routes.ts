import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./componentes/inicio').then((m) => m.InicioComponent),
    pathMatch: 'full'
  },
  {
    path: 'land',
    loadComponent: () => import('./componentes/vector').then((m) => m.ChildScene)
  },
  {
    path: 'tramite',
    loadComponent: () => import('./componentes/tramite').then((m) => m.CreateNoteComponent)
  },
  {
    path: 'socket',
    loadComponent: () => import('./componentes/chat').then((m) => m.AdminComponent)
  },
  {
    path: 'latex',
    loadComponent: () => import('./componentes/latexedit').then((m) => m.CreateNoteComponent)
  },
  {
    path: 'articulo',
    loadComponent: () => import('./componentes/articulos').then((m) => m.ScientificArticlesManagerComponent)
  },
  {
    path: 'actualizacion/:id',
    loadComponent: () => import('./componentes/actualizacion').then((m) => m.CreateNoteComponent)
  },
  {
    path: 'courses',
    loadComponent: () => import('./componentes/curses').then((m) => m.CreateNoteComponent)
  },
  {
    path: 'tema/:idcurso/:idtema',
    loadComponent: () => import('./componentes/actualizaciontheme').then((m) => m.ThemeComponent)
  },
  {
    path: 'updatetest/:idtest',
    loadComponent: () => import('./componentes/actualizacionupdatetest').then((m) => m.TestsComponent)
  },
  {
    path: 'tematest/:curseid/:themeid',
    loadComponent: () => import('./componentes/actualizaciontest').then((m) => m.ExportToExcelComponent)
  },
  {
    path: 'newmodel',
    loadComponent: () => import('./componentes/logomodel3d').then((m) => m.ThreeHtmlCanvasComponent)
  },
  {
    path: 'model/:id/:email',
    loadComponent: () => import('./componentes/model3d').then((m) => m.AppComponent)
  },
  {
    path: 'carreras',
    loadComponent: () => import('./componentes/carreras').then((m) => m.PlyViewerComponent)
  },
  {
    path: 'video/:code',
    loadComponent: () => import('./componentes/video').then((m) => m.VideoComponent)
  },
  {
    path: 'panel',
    loadComponent: () => import('./componentes/panel').then((m) => m.CreateNoteComponent)
  },
  {
    path: 'bot',
    loadComponent: () => import('./componentes/botfather').then((m) => m.BotDashboardComponent)
  },
  {
    path: 'adicionarusuario',
    loadComponent: () => import('./componentes/useradd').then((m) => m.UserFormComponent)
  },
  {
    path: 'actualizarusuario',
    loadComponent: () => import('./componentes/userupdate').then((m) => m.PrivateComponent)
  },
  {
    path: 'game',
    loadComponent: () => import('./componentes/player').then((m) => m.FpsGameComponent)
  },
  {
    path: 'imagen2',
    loadComponent: () => import('./componentes/editorimg').then((m) => m.ContenedorIframeComponent)
  },
  {
    path: 'imagen',
    loadComponent: () => import('./componentes/editorimg copy').then((m) => m.FabricEditorComponent)
  },
  {
    path: 'blender',
    loadComponent: () => import('./componentes/editorimg copy 2').then((m) => m.ModelBoradForm)
  },
  {
    path: 'pintura',
    loadComponent: () => import('./componentes/p5js').then((m) => m.ComplexCanvasComponent)
  },
  {
    path: 'statistic',
    loadComponent: () => import('./componentes/d3js').then((m) => m.SurveyDashboardComponent)
  },
  {
    path: 'sculpt',
    loadComponent: () => import('./componentes/sculpt').then((m) => m.MeshSculptorComponent)
  },
  {
    path: 'audio',
    loadComponent: () => import('./componentes/audio').then((m) => m.MultiTrackAudioPlayerComponent)
  },
  {
    path: 'acerca',
    loadComponent: () => import('./componentes/acerca').then((m) => m.Acerca)
  },
  {
    path: 'exhibicion',
    loadComponent: () => import('./componentes/exhibicion').then((m) => m.VirtualMuseumComponent)
  },
  {
    path: 'exhibicion/:id/:user',
    loadComponent: () => import('./componentes/exhibicionfiles').then((m) => m.ArtCuratorshipComponent)
  },
  {
    path: 'documentos',
    loadComponent: () => import('./componentes/documents').then((m) => m.AdminDashboardComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./componentes/login').then((m) => m.LoginComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./componentes/statbegin').then((m) => m.SStats)
  },
  {
    path: 'blog',
    loadComponent: () => import('./componentes/blogger').then((m) => m.ForumComponent)
  },
  {
    path: 'statest/:tipo/:email',
    loadComponent: () => import('./componentes/substats').then((m) => m.TestsComponent)
  },

  // Redirección para rutas no encontradas
  {
    path: '**',
    redirectTo: ''
  }
]