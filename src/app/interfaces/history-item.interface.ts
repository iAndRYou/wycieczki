import { Timestamp } from "@angular/fire/firestore";

export class HistoryItem {
    constructor(
        public quantity: number,
        public purchaseTimestamp: Timestamp,
        public tripId: string,
        public name: string,
        public location: string,
        public price: number,
        public startDateTimestamp: Timestamp,
        public endDateTimestamp: Timestamp,
    ) { }
}