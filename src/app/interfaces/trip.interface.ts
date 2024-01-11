import { Timestamp } from "@angular/fire/firestore";
import { Review } from "./review.interface";

export class Trip {
    constructor(
        public id: string,
        
        public startDate: Timestamp,
        public endDate: Timestamp,

        public availableTickets: number,
        public name: string,
        public description: string,
        public shortDescription: string,
        public imgs: string[],

        public location: string,
        public mapSrc: string,

        public price: number,
        public ratings: number,
        public reviews: Review[],
        public sumRating: number,
    ) { }
}