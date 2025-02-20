export class SaleDetailsModel {
    constructor(
        public id: number = 0,
        public dishId: number = 0,
        public saleId: number = 0,
        public amount: number = 0,
        public subTotal: number = 0,
    ) {}
}