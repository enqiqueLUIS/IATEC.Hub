import { Component, inject } from '@angular/core';
import { SaleDetailsService } from '../../services/sale-details.service';
import { DishService } from '../../services/dish.service';
import { SaleService } from '../../services/sale.service';
import { PaymentMethodsService } from '../../services/payment-methods.service';
import { SaleDetailsInterface } from '../../models/saleDetails.interface';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { DishInterface } from '../../models/dish.interface';
import { SaleInterface } from '../../models/sale.interface';
import { PaymentMethodsInterface } from '../../models/paymentMethods.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './report.component.html',
})
export class ReportComponent {
  #saleDetailsService = inject(SaleDetailsService);
  #dishService = inject(DishService);
  #saleService = inject(SaleService);
  #paymentMethodService = inject(PaymentMethodsService);

  salesDetails: SaleDetailsInterface[] = [];

  
  constructor() {
    this.#loadSalesDetails();
  }

  #loadSalesDetails() {
    this.#saleDetailsService.getAll$().pipe(
      switchMap(response => 
        !response.length ? of<SaleDetailsInterface[]>([]) :
          forkJoin(response.map(detail =>
            forkJoin({
              dish: this.#dishService.getById$(detail.dishId).pipe(
                catchError(() => of({ id: 0, name: 'Desconocido', price: 0, description: 'No disponible' }))
              ),
              sale: this.#saleService.getById$(detail.saleId).pipe(
                catchError(() => of({ id: 0, saleDate: new Date(), total: 0, paymentMethodId: 0, paymentMethodName: 'No disponible' }))
              )
            }).pipe(
              switchMap(({ dish, sale }) => 
                this.#paymentMethodService.getById$(sale.paymentMethodId).pipe(
                  map(paymentMethod => ({ ...detail, dish, sale, paymentMethod })),
                  catchError(() => of({ ...detail, dish, sale, paymentMethod: { id: 0, name: 'No disponible' } }))
                )
              )
            )
          ))
      )
    ).subscribe({
      next: (salesDetails) => this.salesDetails = salesDetails
    });
  }
  



  

}
