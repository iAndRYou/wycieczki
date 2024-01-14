import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, docData, updateDoc, deleteDoc, addDoc, setDoc, Timestamp, getDocs} from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { Trip } from '../interfaces/trip.interface';
import { CartItem } from '../interfaces/cart-item.interface';
import { Currency } from '../interfaces/currency.interface';
import { environment } from '../../environments/environment';
import { HistoryItem } from '../interfaces/history-item.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  firestore: Firestore = inject(Firestore);

  async addUser(userId: string) {
    await setDoc(doc(this.firestore, 'users', userId), {'role': 'user'});
  }
  
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

  getHistory$(userId: string) {
    return collectionData(collection(this.firestore, 'users', userId, 'history')) as Observable<HistoryItem[]>;
  }

  async updateItemInCart(userId: string, tripId: string, quantity?: number, selected?: boolean) {
    try {
      var docRef = doc(this.firestore, 'users', userId, 'cart', tripId);
      
      var currentCart = await firstValueFrom(docData(docRef)) as CartItem;
      currentCart.quantity += quantity? quantity : 0;
      currentCart.selected = selected? selected : false;

      await updateDoc(docRef, {...currentCart});
    } catch (error) {
      var docRef = doc(this.firestore, 'users', userId, 'cart', tripId)
      await setDoc(docRef, { tripId: tripId, quantity: quantity!, selected: true });
    }
  }

  async removeItemFromCart(userId: string, cartItem: CartItem) {
    await deleteDoc(doc(this.firestore, 'users', userId, 'cart', cartItem.tripId));
  }

  async removeItemFromAllCarts(tripId: string) {
    var usersCollectionRef = collection(this.firestore, 'users');
    var usersQuerySnapshot = await getDocs(usersCollectionRef);

    usersQuerySnapshot.docs.forEach(async (user) => {
      await deleteDoc(doc(this.firestore, 'users', user.id, 'cart', tripId));
    });
  }

  async buyItemFromCart(userId: string, cartItem: CartItem) {
    var tripDocRef = doc(this.firestore, 'trip', cartItem.tripId);
    var trip = await firstValueFrom(docData(tripDocRef)) as Trip;

    await addDoc(collection(this.firestore, 'users', userId, 'history'), {
        quantity: cartItem.quantity,
        purchaseTimestamp: Timestamp.now(),
        tripId: trip.id,
        name: trip.name,
        location: trip.location,
        price: trip.price,
        startDateTimestamp: trip.startDate,
        endDateTimestamp: trip.endDate,
      } as HistoryItem);
    
    await deleteDoc(doc(this.firestore, 'users', userId, 'cart', cartItem.tripId));
  }

  async addNewTrip(trip: Trip) {
    var id = trip.name.toLowerCase().replace(/ /g, '-');
    await setDoc(doc(this.firestore, 'trip', id), { ...trip, id: id });
  }

  async updateTrip(trip: Trip) {
    await updateDoc(doc(this.firestore, 'trip', trip.id), { ...trip});
  }

  async deleteTrip(trip: Trip) {
    await this.removeItemFromAllCarts(trip.id);
    await deleteDoc(doc(this.firestore, 'trip', trip.id));
  }
}
