import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { SaleModel } from '../models/sale.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';
import { SuintApiResponseInterface } from '../../../core/models/api-response.interface';
import { SaleInterface } from '../models/sale.interface';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor() { }

  #endPoint = 'http://localhost:5158/sales';
  #httpClient = inject(HttpClient);

  addSale$(date: SaleModel, saleId: number | null, destroyRef: DestroyRef) {
    return this.#httpClient.post<SaleModel>(`${this.#endPoint}`, date)
    .pipe(takeUntilDestroyed(destroyRef));
  }

  updateSale$(saleId: number, date: SaleModel, destroyRef: DestroyRef) {
    return this.#httpClient.put<SaleModel>(`${this.#endPoint}/${saleId}`, date)
    .pipe(takeUntilDestroyed(destroyRef));
  }

  getAll$() {
    return this.#httpClient.get<SuintApiResponseInterface<SaleInterface[]>>(`${this.#endPoint}`)
    .pipe(
      catchError((error) => this.#handleError(error))
    )
  }

  getById$(saleId: number) {
    return this.#httpClient.get<SuintApiResponseInterface<SaleInterface>>(`${this.#endPoint}/get-by-id/${saleId}`)
    .pipe(
      catchError((error) => this.#handleError(error))
    );
  }

  deleteSale$(saleId: number) {
    return this.#httpClient.delete<boolean>(`${this.#endPoint}/${saleId}`)
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
