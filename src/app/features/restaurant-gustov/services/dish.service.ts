import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { DishModel } from '../models/dish.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SuintApiResponseInterface } from '../../../core/models/api-response.interface';
import { DishInterface } from '../models/dish.interface';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  #endPoint = 'http://localhost:5158/dish';
  #httpClient = inject(HttpClient);

  addDish$(data: DishModel, dishId: number | null, destroyRef: DestroyRef) {
    return this.#httpClient.post<DishModel>(`${this.#endPoint}`, data)
      .pipe(takeUntilDestroyed(destroyRef));
  }
  
  updateDish$(dishId: number, data: DishModel, destroyRef: DestroyRef) {
    return this.#httpClient.put<DishModel>(`${this.#endPoint}/${dishId}`, data)
      .pipe(takeUntilDestroyed(destroyRef));
  }
  
  getAll$() {
    return this.#httpClient.get<SuintApiResponseInterface<DishInterface[]>>(`${this.#endPoint}`)
    .pipe(
      catchError((error) => this.#handleError(error))
    )
  }

  getById$(dishId: number) {
    return this.#httpClient.get<DishInterface>(`${this.#endPoint}/${dishId}`)
      .pipe(
        catchError((error) => this.#handleError(error))
      );
  }
  
  deleteDish$(dishId: number) {
    return this.#httpClient.delete<boolean>(`${this.#endPoint}/${dishId}`)
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
