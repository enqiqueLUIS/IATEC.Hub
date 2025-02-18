import { Component } from '@angular/core';
import GustovComponent from '../restaurant-gustov/views/gustov/gustov.component';
import { Router, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/views/index/home.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ RouterModule, HomeComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {

}
