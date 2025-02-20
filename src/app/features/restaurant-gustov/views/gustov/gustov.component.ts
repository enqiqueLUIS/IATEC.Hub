import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DishComponent } from '../../controls/dish/dish.component';
import { PaymentMethodsComponent } from '../../controls/payment-methods/payment-methods.component';
import { HttpClientModule } from '@angular/common/http';
import { SaleComponent } from '../../controls/sale-dashboard/sale/sale.component';
import { SaleDetailsComponent } from '../../controls/sale-dashboard/sale-details/sale-details.component';
import { SaleDashboardComponent } from '../../controls/sale-dashboard/sale-dashboard.component';
import { ReportComponent } from '../../controls/report/report.component';

@Component({
  selector: 'features-gustov',
  standalone: true,
  imports: [RouterModule, CommonModule, DishComponent, HttpClientModule, PaymentMethodsComponent, SaleDashboardComponent, ReportComponent],
  templateUrl: './gustov.component.html',
})
export default class GustovComponent {
  isMenuOpen = false;
  activeSection: string | null = null;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }
}


