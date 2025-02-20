import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { SaleDetailsModel } from '../models/saleDetails.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';
import { SuintApiResponseInterface } from '../../../core/models/api-response.interface';
import { SaleDetailsInterface } from '../models/saleDetails.interface';

@Injectable({
  providedIn: 'root'
})
export class SaleDetailsService {

  constructor() { }

  #endPoint = 'http://localhost:5158/sale-details';
  #httpClient = inject(HttpClient);

  addSaleDetail$(date: SaleDetailsModel, saleDetailId: number | null, destroyRef: DestroyRef) {
    return this.#httpClient.post<SaleDetailsModel>(`${this.#endPoint}`, date)
    .pipe(takeUntilDestroyed(destroyRef));
  }

  updateSaleDetail$(saleDetailId: number, date: SaleDetailsModel, destroyRef: DestroyRef) {
    return this.#httpClient.put<SaleDetailsModel>(`${this.#endPoint}/${saleDetailId}`, date)
    .pipe(takeUntilDestroyed(destroyRef));
  }

  getAll$() {
    return this.#httpClient.get<SuintApiResponseInterface<SaleDetailsInterface[]>>(`${this.#endPoint}`)
    .pipe(
      catchError((error) => this.#handleError(error))
      );
  }

  getById$(saleDetailId: number) {
    return this.#httpClient.get<SaleDetailsInterface>(`${this.#endPoint}/${saleDetailId}`)
    .pipe(
      catchError((error) => this.#handleError(error))
    );
  }

  deleteSaleDetail$(saleDetailId: number) {
    return this.#httpClient.delete<boolean>(`${this.#endPoint}/${saleDetailId}`)
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
