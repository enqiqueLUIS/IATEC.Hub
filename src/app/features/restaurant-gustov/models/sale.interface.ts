export interface SaleInterface {
    id:              number;
    saleDate:        Date;
    total:           number;
    paymentMethodId: number;
    paymentMethodName?: string; 
}