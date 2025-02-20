import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { SaleService } from '../../../services/sale.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SaleInterface } from '../../../models/sale.interface';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { PaymentMethodsService } from '../../../services/payment-methods.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale.component.html'
})
export class SaleComponent {
  #saleService = inject(SaleService);
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);
  #paymentMethodService = inject(PaymentMethodsService);
  sales: SaleInterface[] = [];
  paymentMethods: { id: number; name: string; }[] = [];

  isModalOpen = false;
  isEditing = false;
  currentSale: SaleInterface = { id: 0, saleDate: new Date(), total: 0, paymentMethodId: 0 };
  today: string = new Date().toISOString().split('T')[0];

  constructor() {
    this.#loadSales();
    this.#loadPaymentMethods(); 
  }

  #loadSales() {
    this.#saleService.getAll$()
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        switchMap((response) => {
          if (response.isSuccess !== undefined && !response.isSuccess) {
            return of([]); 
          }
          const salesData = Array.isArray(response) ? response : response.data || [];

          const salesWithPaymentMethods$ = salesData.map(sale =>
            this.#paymentMethodService.getById$(sale.paymentMethodId).pipe(
              map(paymentResponse => {
                const paymentMethodName = paymentResponse.name || 'Desconocido';
                return {
                  ...sale,
                  paymentMethodName
                };
              })
              
            ),
          )
          
          return forkJoin(salesWithPaymentMethods$);
        })
      )
      .subscribe({
        next: (salesWithPaymentMethods) => {
          this.sales = salesWithPaymentMethods;
          this.#cdr.detectChanges();
        },
      });
  }

  #loadPaymentMethods() {
    this.#paymentMethodService.getAll$()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response && Array.isArray(response)) {
            this.paymentMethods = response;
          }
        },
      });
  }

  openCreateModal() {
    this.isEditing = false;
    this.currentSale = { id: 0, saleDate: new Date(), total: 0, paymentMethodId: 0 };
    this.isModalOpen = true;
  }

  openEditModal(sale: SaleInterface) {
    this.isEditing = true;
    this.currentSale = { ...sale };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.currentSale = { id: 0, saleDate: new Date(), total: 0, paymentMethodId: 0 };
    this.#cdr.detectChanges();
  }

  saveSale() {
    if (!this.currentSale.paymentMethodId) {
      return;
    }
  
    if (this.isEditing) {
      this.#saleService.updateSale$(this.currentSale.id!, this.currentSale, this.#destroyRef)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (response) => {
            if (response && response.id) {
              this.#loadSales();
              this.closeModal();
            }
          },
        });
    } else {
      this.#saleService.addSale$(this.currentSale, null, this.#destroyRef)
        .pipe(
          takeUntilDestroyed(this.#destroyRef),
          switchMap((response) => {
            if (response && typeof response.id === 'number') {
              return this.#paymentMethodService.getById$(response.paymentMethodId).pipe(
                map(paymentResponse => {
                  return {
                    ...response,
                    paymentMethodName: paymentResponse?.name || 'Desconocido'
                  };
                })
              );
            }
            return of(null);
          })
        )
        .subscribe({
          next: (updatedSale) => {
            if (updatedSale) {
              this.sales = [...this.sales, updatedSale]; 
              this.#cdr.detectChanges();
              this.closeModal();
            }
          },
        });
    }
  }
  

  updateSale(saleId: number, updatedSale: SaleInterface) {
    if (!updatedSale.paymentMethodId) {
      return;
    }
  
    this.#saleService.updateSale$(saleId, updatedSale, this.#destroyRef)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.#loadSales(); 
            this.#cdr.detectChanges(); 
            this.closeModal(); 
          }
        },
      });
  }

  deleteSale(saleId: number) {
    this.#saleService.deleteSale$(saleId)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.sales = this.sales.filter(sale => sale.id !== saleId); 
            this.#cdr.detectChanges();
          }
        },
      });
  }

  
  

}
