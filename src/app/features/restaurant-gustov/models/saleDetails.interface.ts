import { DishInterface } from "./dish.interface";
import { PaymentMethodsInterface } from "./paymentMethods.interface";
import { SaleInterface } from "./sale.interface";

export interface SaleDetailsInterface {
    id:       number;
    dishId:   number;
    saleId:   number;
    amount:   number;
    subTotal: number;
    dish?: DishInterface; 
  sale?: SaleInterface;
  paymentMethod?: PaymentMethodsInterface;
}