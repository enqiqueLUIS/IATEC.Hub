import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full' ,
        redirectTo: 'home'
    },
    {
        path: '',
        loadChildren: () =>import('./features/main-layout/main.routes')
    },
    
];
