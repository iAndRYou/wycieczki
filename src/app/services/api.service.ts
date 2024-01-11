import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Trip } from '../interfaces/trip.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  firestore: Firestore = inject(Firestore);
  
  get getAllTrips$() {
    return collectionData(collection(this.firestore, 'trip')) as Observable<Trip[]>;
  }
}
