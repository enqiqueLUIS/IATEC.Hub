export class SaleModel {
    constructor(
        public id: number = 0,
        public saleDate: Date = new Date(),
        public total: number = 0,
        public paymentMethodId: number = 0,
    ) {}
}