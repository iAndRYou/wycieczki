import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, docData, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Trip } from '../interfaces/trip.interface';
import { CartItem } from '../interfaces/cart-item.interface';
import { Currency } from '../interfaces/currency.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  firestore: Firestore = inject(Firestore);
  
  get currency$(): Observable<Currency> {
    return docData(doc(this.firestore, 'settings', 'currency')) as Observable<Currency>;
  }

  async changeCurrency(currency: string) {
    var multiplier = 1;
    if (currency == 'USD') {
      multiplier = +environment.currencies.USD
    } else if (currency == 'EUR') {
      multiplier = +environment.currencies.EUR
    } else if (currency == 'GBP') {
      multiplier = +environment.currencies.GBP
    } else if (currency == 'PLN') {
      multiplier = +environment.currencies.PLN
    }
    await updateDoc(doc(this.firestore, 'settings', 'currency'), { name: currency, multiplier: multiplier });
  }

  get getAllTrips$() {
    return collectionData(collection(this.firestore, 'trip')) as Observable<Trip[]>;
  }

  getTrip$(id: string) {
    return docData(doc(this.firestore, 'trip', id)) as Observable<Trip>;
  }

  getCart$(userId: string) {
    return collectionData(collection(this.firestore, 'users', userId, 'cart')) as Observable<CartItem[]>;
  }

  async updateItemInCart(userId: string, cartItem: CartItem) {
    // check if doc 'users/userId/cart/cartItem.tripId' exists
    // if it does, update it
    // if it doesn't, create it
    try {
      var docRef = doc(this.firestore, 'users', userId, 'cart', cartItem.tripId)
      await updateDoc(docRef, {'quantity': cartItem.quantity});
      console.log('updated');
    } catch (error) {
      await addDoc(collection(this.firestore, 'users', userId, 'cart', cartItem.tripId), cartItem);
      console.log('added');
    }
  }

  async addNewTrip(trip: Trip) {
    var docRef = await addDoc(collection(this.firestore, 'trip'), trip);
    await updateDoc(docRef, { id: docRef.id });
  }

  async updateTrip(trip: Trip) {
    await updateDoc(doc(this.firestore, 'trip', trip.id), { ...trip});
  }
}
