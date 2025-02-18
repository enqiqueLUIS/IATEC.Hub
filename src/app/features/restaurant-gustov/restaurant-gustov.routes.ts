import { Routes } from '@angular/router';
import GustovComponent from './views/gustov/gustov.component';

const restaurantGustovRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./views/gustov/gustov.component')
    }
];

export default restaurantGustovRoutes;
