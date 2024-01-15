import { Timestamp } from "@angular/fire/firestore";
import { Review } from "./review.interface";
import { Rating } from "./rating.interface";

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
        public ratings: Rating[],
        public reviews: Review[],
    ) { }

    get averageRating(): number {
        return this.ratings ? 
        this.ratings.map(rating => rating.rating).reduce((a, b) => a + b, 0) || 0 
        : 0
    }
}