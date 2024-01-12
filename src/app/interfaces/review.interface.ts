import { Timestamp } from "@angular/fire/firestore";

export class Review {
    constructor(
        public nick: string,
        public name: number,
        public text: string,
        public date: Timestamp,
    ) { }
}