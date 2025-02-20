import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DishComponent } from '../../controls/dish/dish.component';
import { PaymentMethodsComponent } from '../../controls/payment-methods/payment-methods.component';
import { HttpClientModule } from '@angular/common/http';
import { SaleComponent } from '../../controls/sale-dashboard/sale/sale.component';

@Component({
  selector: 'features-gustov',
  standalone: true,
  imports: [RouterModule, CommonModule, DishComponent, HttpClientModule, PaymentMethodsComponent, SaleComponent],
  templateUrl: './gustov.component.html',
})
export default class GustovComponent {
  isMenuOpen = false;
  isDishesVisible = false;
  isPaymentMethodsVisible = false;
  isSaleVisible = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDishes() {
    const wasVisible = this.isDishesVisible;
    this.isDishesVisible = !wasVisible;
    this.isPaymentMethodsVisible = false;
    this.isSaleVisible = false;
  }

  togglePaymentMethods() {
    const wasVisible = this.isPaymentMethodsVisible;
    this.isPaymentMethodsVisible = !wasVisible;
    this.isDishesVisible = false;
    this.isSaleVisible = false;
  }

  toggleSale() {
    const wasVisible = this.isSaleVisible;
    this.isSaleVisible = !wasVisible;
    this.isDishesVisible = false;
    this.isPaymentMethodsVisible = false;
  }
}

