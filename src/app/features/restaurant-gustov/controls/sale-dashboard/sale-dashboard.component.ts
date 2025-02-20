import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SaleComponent } from './sale/sale.component';
import { SaleDetailsComponent } from './sale-details/sale-details.component';

@Component({
  selector: 'app-sale-dashboard',
  standalone: true,
  imports: [CommonModule, SaleComponent, SaleDetailsComponent],
  templateUrl: './sale-dashboard.component.html',
})
export class SaleDashboardComponent {

}
