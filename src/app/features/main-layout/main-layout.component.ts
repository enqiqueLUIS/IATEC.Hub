import { Component } from '@angular/core';
import GustovComponent from '../restaurant-gustov/views/gustov/gustov.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from '../home/views/index/home.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {

}
