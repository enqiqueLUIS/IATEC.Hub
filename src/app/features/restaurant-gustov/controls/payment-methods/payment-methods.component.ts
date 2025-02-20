import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentMethodsService } from '../../services/payment-methods.service';
import { PaymentMethodsInterface } from '../../models/paymentMethods.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './payment-methods.component.html',
})
export class PaymentMethodsComponent {
  #paymentMethodService = inject(PaymentMethodsService);
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);
  paymentMethods: PaymentMethodsInterface[] = [];

  isModalOpen = false;
  isEditing = false;
  currentPaymentMethod: PaymentMethodsInterface = { id: 0, name: ''};

  constructor() {
    this.#loadPaymentMethods();
  }

  #loadPaymentMethods() {
    this.#paymentMethodService.getall$()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response.isSuccess !== undefined && !response.isSuccess) {
          } else if (Array.isArray(response)) {
            this.paymentMethods = response; 
          } else if (response.data) {
            this.paymentMethods = response.data; 
          }
          this.#cdr.detectChanges();
        },
      });
  }

  openCreateModal() {
    this.isEditing = false;
    this.currentPaymentMethod = { id: 0, name: ''};
    this.isModalOpen = true;
  }

  openEdtModal(paymentMethod: PaymentMethodsInterface) {
    this.isEditing = true;
    this.currentPaymentMethod = { ...paymentMethod };
    this.isModalOpen = true;
  }

  savePaymentMethod() {
    if (this.isEditing) {
      this.#paymentMethodService.updatePaymentMethod$(this.currentPaymentMethod.id!, this.currentPaymentMethod, this.#destroyRef)
      .subscribe({
        next: (response) => {
          if (response && response.id) {
            this.#loadPaymentMethods();
            this.closeModal();
          }
        },
      });
    } else {
      this.#paymentMethodService.addPaymentMethod$(this.currentPaymentMethod, null, this.#destroyRef)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response && typeof response.id === 'number') {
            this.paymentMethods = [...this.paymentMethods, response];
            this.#cdr.detectChanges();
            this.closeModal();
          }
        }
      })
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.currentPaymentMethod = { id: 0, name: ''};
    this.#cdr.detectChanges();
  }

  updatePaymentMethod(paymentMethodId: number, updatePaymentMethod: PaymentMethodsInterface) {
    this.#paymentMethodService.updatePaymentMethod$(paymentMethodId, updatePaymentMethod, this.#destroyRef)
    .pipe(takeUntilDestroyed(this.#destroyRef))
    .subscribe({
      next: (response) => {
        if (response) {
          this.#loadPaymentMethods();
        }
      }
    });
  }

  deletePaymentMethod(paymentMethodId: number) {
    this.#paymentMethodService.deletePaymentMethod$(paymentMethodId)
    .pipe(takeUntilDestroyed(this.#destroyRef))
    .subscribe({
      next: (response) => {
        if (response) {
          this.paymentMethods = this.paymentMethods.filter(paymentMethods => paymentMethods.id !== paymentMethodId);
        }
      }
    });
  }

}
