import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { SaleDetailsService } from '../../../services/sale-details.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { DishService } from '../../../services/dish.service';
import { SaleService } from '../../../services/sale.service';
import { SaleDetailsInterface } from '../../../models/saleDetails.interface';
import { CommonModule } from '@angular/common';
import { DishInterface } from '../../../models/dish.interface';
import { SaleInterface } from '../../../models/sale.interface';
import { PaymentMethodsService } from '../../../services/payment-methods.service';
import { PaymentMethodsInterface } from '../../../models/paymentMethods.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-details.component.html',
})
export class SaleDetailsComponent {
  #saleDetailsService = inject(SaleDetailsService);
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);
  #dishService = inject(DishService);
  #saleService = inject(SaleService);
  salesDetails: SaleDetailsInterface[] = [];
  paymentMethods: PaymentMethodsInterface[] = [];
  dishes: { id: number; name: string; price: number; description: string }[] = [];
  sales: { id: number; saleDate: string; total: number; paymentMethodId: number }[] = [];

  isModalOpen = false;
  isEditing = false;
  curretSaleDetail: SaleDetailsInterface = {
    id: 0, dishId: 0, saleId: 0, amount: 0, subTotal: 0,
    dish: undefined,
    sale: undefined,
    paymentMethod: undefined
  };

  #paymentMethodService = inject(PaymentMethodsService);

  constructor() {
    this.#loadSalesDetails();
    this.#loadDishes();
    this.#loadSales();
  }

  #loadSalesDetails() {
    this.#saleDetailsService.getAll$()
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        switchMap(response => {
          if (!response || !Array.isArray(response) || response.length === 0) return of<SaleDetailsInterface[]>([]);

          return forkJoin(response.map(detail =>
            forkJoin({
              dish: this.#dishService.getById$(detail.dishId).pipe(
                catchError(() => of({ id: 0, name: 'Desconocido', price: 0, description: 'No disponible' } as DishInterface))
              ),
              sale: this.#saleService.getById$(detail.saleId).pipe(
                catchError(() => of({ id: 0, saleDate: new Date(), total: 0, paymentMethodId: 0, paymentMethodName: 'No disponible' } as SaleInterface))
              )
            }).pipe(
              switchMap(({ dish, sale }) => 
                this.#paymentMethodService.getById$(sale.paymentMethodId).pipe(
                  map((paymentMethod: PaymentMethodsInterface) => ({
                    ...detail,
                    dish,
                    sale,
                    paymentMethod
                  }) as SaleDetailsInterface),
                  catchError(() => of({
                    ...detail,
                    dish,
                    sale,
                    paymentMethod: { id: sale.paymentMethodId, name: 'Desconocido' }
                  } as SaleDetailsInterface))
                )
              )
            )
          ));
        })
      )
      .subscribe({
        next: salesDetails => {
          this.salesDetails = salesDetails;
          this.#cdr.detectChanges();
        }
      });
}


  #loadDishes() {
    this.#dishService.getAll$()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response && Array.isArray(response)) {
            this.dishes = response;
          }
        }
      });
  }

  #loadSales() {
    this.#saleService.getAll$()
    .pipe(takeUntilDestroyed(this.#destroyRef))
    .subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.sales = response;
        }
      }
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.curretSaleDetail = { id: 0, dishId: 0, saleId: 0, amount: 0, subTotal: 0, dish: undefined, sale: undefined, paymentMethod: undefined };
    this.isModalOpen = true;
  }

  openEditModal(saleDetail: SaleDetailsInterface) {
    this.isEditing = true;
    this.curretSaleDetail = { ...saleDetail };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.curretSaleDetail = { id: 0, dishId: 0, saleId: 0, amount: 0, subTotal: 0, dish: undefined, sale: undefined, paymentMethod: undefined };
    this.#cdr.detectChanges();
  }

  saveSaleDetail() {
    if (!this.curretSaleDetail.dishId || !this.curretSaleDetail.saleId || this.curretSaleDetail.amount <= 0) {
      return;
    }
  
    if (this.isEditing) {
      this.#saleDetailsService.updateSaleDetail$(this.curretSaleDetail.id!, this.curretSaleDetail, this.#destroyRef)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (response) => {
            if (response && response.id) {
              this.#loadSalesDetails();
              this.closeModal();
            }
          },
        });
    } else {
      this.#saleDetailsService.addSaleDetail$(this.curretSaleDetail, null, this.#destroyRef)
        .pipe(
          takeUntilDestroyed(this.#destroyRef),
          switchMap((response) => {
            if (!response || typeof response.id !== 'number') return of(null);
  
            return forkJoin({
              dish: this.#dishService.getById$(response.dishId).pipe(catchError(() => of(null))),
              sale: this.#saleService.getById$(response.saleId).pipe(catchError(() => of(null)))
            }).pipe(
              switchMap(({ dish, sale }) => {
                if (!dish || !sale) return of(null);
  
                return this.#paymentMethodService.getById$(sale.paymentMethodId).pipe(
                  map((paymentMethod: PaymentMethodsInterface) => ({
                    ...response,
                    dish,
                    sale,
                    paymentMethod
                  })),
                  catchError(() => of({
                    ...response,
                    dish,
                    sale,
                    paymentMethod: { id: sale.paymentMethodId, name: 'Desconocido' }
                  }))
                );
              })
            );
          })
        )
        .subscribe({
          next: (updatedSaleDetail) => {
            if (updatedSaleDetail) {
              this.salesDetails = [...this.salesDetails, updatedSaleDetail];
              this.#cdr.detectChanges();
              this.closeModal();
            }
          },
        });
    }
  }

  updateSaleDetail(saleDetailId: number, updatedSaleDetail: SaleDetailsInterface) {
    if (!updatedSaleDetail.dishId || !updatedSaleDetail.saleId || updatedSaleDetail.amount <= 0) {
      return;
    }
  
    this.#saleDetailsService.updateSaleDetail$(saleDetailId, updatedSaleDetail, this.#destroyRef)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        switchMap((response) => {
          if (!response || typeof response.id !== 'number') return of(null);
  
          return forkJoin({
            dish: this.#dishService.getById$(response.dishId).pipe(catchError(() => of(null))),
            sale: this.#saleService.getById$(response.saleId).pipe(catchError(() => of(null)))
          }).pipe(
            switchMap(({ dish, sale }) => {
              if (!dish || !sale) return of(null);
  
              return this.#paymentMethodService.getById$(sale.paymentMethodId).pipe(
                map((paymentMethod: PaymentMethodsInterface) => ({
                  ...response,
                  dish,
                  sale,
                  paymentMethod
                })),
                catchError(() => of({
                  ...response,
                  dish,
                  sale,
                  paymentMethod: { id: sale.paymentMethodId, name: 'Desconocido' }
                }))
              );
            })
          );
        })
      )
      .subscribe({
        next: (updatedDetail) => {
          if (updatedDetail) {
            this.#loadSalesDetails();
            this.#cdr.detectChanges();
            this.closeModal();
          }
        },
      });
  }
  
  deleteSaleDetail(saleDetailId: number) {
    this.#saleDetailsService.deleteSaleDetail$(saleDetailId)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.salesDetails = this.salesDetails.filter(detail => detail.id !== saleDetailId);
            this.#cdr.detectChanges();
          }
        },
      });
  }
}
