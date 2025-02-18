import { Routes } from "@angular/router";
import { MainLayoutComponent } from "./main-layout.component";
import { HomeComponent } from "../home/views/index/home.component";

export const mainLayoutRoutes: Routes = [
    {
        path:'',
        pathMatch: 'full',
        redirectTo: ''
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
                loadChildren: () => import('../home/home.routes')
            }
        ]
    },
    {
        path: 'restaurant-gustov',
        loadChildren: () => import('../restaurant-gustov/restaurant-gustov.routes')
    },
    
];

export default mainLayoutRoutes;