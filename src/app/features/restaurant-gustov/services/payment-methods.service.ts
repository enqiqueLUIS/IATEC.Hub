import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { PaymentMethodsModel } from '../models/PaymentMethods.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SuintApiResponseInterface } from '../../../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsService {

  constructor() { }

  #endPoint = 'http://localhost:5158/payment-methods';
  #httpClient = inject(HttpClient);

  addPaymentMethod$(data: PaymentMethodsModel, paymentMethodsId: number | null, destroyRef: DestroyRef) {
    return this.#httpClient.post<PaymentMethodsModel>(`${this.#endPoint}`, data)
    .pipe(takeUntilDestroyed(destroyRef));
  }

  updatePaymentMethod$(paymentMethodsId: number, data: PaymentMethodsModel, destroyRef: DestroyRef) {
    return this.#httpClient.put<PaymentMethodsModel>(`${this.#endPoint}/${paymentMethodsId}`, data)
    .pipe(takeUntilDestroyed(destroyRef));
  }

  getall$() {
    return this.#httpClient.get<SuintApiResponseInterface<PaymentMethodsModel[]>>(`${this.#endPoint}`)
    .pipe(
      catchError((error) => this.#handleError(error))
    )
  }

  getById$(paymentMethodsId: number) {
    return this.#httpClient.get<SuintApiResponseInterface<PaymentMethodsModel>>(`${this.#endPoint}/get-by-id/${paymentMethodsId}`)
    .pipe(
      catchError((error) => this.#handleError(error))
    );
  }

  deletePaymentMethod$(paymentMethodsId: number) {
    return this.#httpClient.delete<boolean>(`${this.#endPoint}/${paymentMethodsId}`)
    .pipe(
      catchError((error) => this.#handleError(error))
    );
  }


  #handleError(error: HttpErrorResponse) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error frontend: ${error.error.message}`;
      } else {
        errorMessage = `Error backend Code: ${error.status}\nMessage: ${JSON.stringify(error.error)}`;
      }
      return throwError(() => error);
  }
}
