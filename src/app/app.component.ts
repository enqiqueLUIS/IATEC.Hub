import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import GustovComponent from './features/restaurant-gustov/views/gustov/gustov.component';
import mainLayoutRoutes from './features/main-layout/main.routes';
import { MainLayoutComponent } from './features/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule, MainLayoutComponent],
  templateUrl: './app.component.html',
})
export class  AppComponent  {
  title = 'IATEC.Hub';
}
