import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { DishService } from '../../services/dish.service';
import { DishInterface } from '../../models/dish.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClientModule } from '@angular/common/http';
import { DishModel } from '../../models/dish.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dish',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dish.component.html',
})
export class DishComponent {
  #dishService = inject(DishService);
  #destroyRef = inject(DestroyRef);
  #cdr = inject(ChangeDetectorRef);
  dishes: DishInterface[] = [];

  isModalOpen = false;
  isEditing = false;
  currentDish: DishModel = { id: 0, name: '', description: '', price: 0 };

  constructor() {
    this.#loadDishes();
    
  }

  #loadDishes() {
    this.#dishService.getAll$()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response.isSuccess !== undefined && !response.isSuccess) {
          } else if (Array.isArray(response)) {
            this.dishes = response; 
          } else if (response.data) {
            this.dishes = response.data; 
          }
          this.#cdr.detectChanges();
        },
      });
  }

  openCreateModal() {
    this.isEditing = false;
    this.currentDish = { id: 0, name: '', description: '', price: 0 };
    this.isModalOpen = true;
  }

  openEditModal(dish: DishInterface) {
    this.isEditing = true;
    this.currentDish = { ...dish };
    this.isModalOpen = true;
  }

  

  saveDish() {
    if (this.isEditing) {
      this.#dishService.updateDish$(this.currentDish.id!, this.currentDish, this.#destroyRef)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (response) => {
            if (response && response.id) {
              this.#loadDishes(); 
              this.closeModal();
            }
          },
        });
    } else {
      this.#dishService.addDish$(this.currentDish, null, this.#destroyRef)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (response) => {
            if (response && typeof response.id === 'number') {  
              this.dishes = [...this.dishes, response];  
              this.#cdr.detectChanges();  
              this.closeModal();
            }
          },
        });
    }
  }
  
  
  
  
  closeModal() {
    this.isModalOpen = false;
    this.currentDish = { id: 0, name: '', description: '', price: 0 };
    this.#cdr.detectChanges(); 
  }

  updateDish(dishId: number, updatedDish: DishModel) {
    this.#dishService.updateDish$(dishId, updatedDish, this.#destroyRef)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.#loadDishes();
          }
        },
      });
  }

  deleteDish(dishId: number) {
    this.#dishService.deleteDish$(dishId)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.dishes = this.dishes.filter(dish => dish.id !== dishId); 
            this.#cdr.detectChanges(); 
          }
        },
      });
  }
  

  
}
