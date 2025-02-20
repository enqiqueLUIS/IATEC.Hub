import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DishComponent } from '../../controls/dish/dish.component';
import { PaymentMethodsComponent } from '../../controls/payment-methods/payment-methods.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'features-gustov',
  standalone: true,
  imports: [RouterModule, CommonModule, DishComponent, HttpClientModule, PaymentMethodsComponent],
  templateUrl: './gustov.component.html',
})
export default class GustovComponent  {
  isMenuOpen = false;
  isDishesVisible = false;
  isPaymentMethodsVisible = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDishes() {
    this.isDishesVisible = !this.isDishesVisible;
    if (this.isDishesVisible) {
      this.isPaymentMethodsVisible = false;
    }
  }

  togglePaymentMethods() {
    this.isPaymentMethodsVisible = !this.isPaymentMethodsVisible;
    if (this.isPaymentMethodsVisible) {
      this.isDishesVisible = false;
    }
  }

}
