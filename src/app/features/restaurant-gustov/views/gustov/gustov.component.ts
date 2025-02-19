import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DishComponent } from '../../controls/dish/dish.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'features-gustov',
  standalone: true,
  imports: [RouterModule, CommonModule, DishComponent, HttpClientModule],
  templateUrl: './gustov.component.html',
})
export default class GustovComponent  {
  isMenuOpen = false;
  isDishesVisible = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDishes() {
    this.isDishesVisible = !this.isDishesVisible;
  }

}
