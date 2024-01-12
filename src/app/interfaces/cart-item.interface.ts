export class CartItem {
    constructor(
        public selected: boolean,
        public quantity: number,
        public tripId: string,
    ) { }
}