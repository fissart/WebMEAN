import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'video/:code',
    renderMode: RenderMode.Client
  },
  {
    path: 'statest/:tipo/:email',
    renderMode: RenderMode.Client
  },
  {
    path: 'tema/:idcurso/:idtema',
    renderMode: RenderMode.Client
  },
  {
    path: 'updatetest/:idtest',
    renderMode: RenderMode.Client
  },
  {
    path: 'tematest/:curseid/:themeid',
    renderMode: RenderMode.Client
  },
  {
    path: 'tematest/:curseid/:themeid',
    renderMode: RenderMode.Client
  },
  {
  path: 'exhibicion/:id/:user',
  renderMode: RenderMode.Client
  },
  {
  path: 'model/:id/:email',
  renderMode: RenderMode.Client
  },
  {
    path: 'actualizacion/:id', 
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
