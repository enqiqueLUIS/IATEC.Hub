import { Routes } from "@angular/router";

const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/main/main.component').then((c) =>c.MainComponent),
  }

];

export default homeRoutes;