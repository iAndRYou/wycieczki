import { Component, OnInit } from '@angular/core';
import { Trip } from '../../interfaces/trip.interface';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../../components/rating/rating.component';
import { Currency } from '../../interfaces/currency.interface';
import { AuthService } from '../../services/auth.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingComponent, CartComponent],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit {
  userId: string | undefined = '';
  public trips: Trip[] = [];
  currency: Currency = {} as Currency;
  starFilters = {stars3: false, stars4: false, stars5: false}

  constructor(
    private api: ApiService,
    private authService: AuthService
  ) { }

  get highestPrice(): number {
    if (this.trips.length === 0) {
      return 0;
    }
    return this.trips.map(trip => trip.price).reduce((a, b) => Math.max(a, b));
  }

  get lowestPrice(): number {
    if (this.trips.length === 0) {
      return 0;
    }
    return this.trips.map(trip => trip.price).reduce((a, b) => Math.min(a, b));
  }

  ngOnInit(): void {
    this.api.getAllTrips$.subscribe(trips => this.trips = trips);
    this.api.currency$.subscribe(currency => this.currency = currency);
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      } else {
        this.userId = undefined;
      }
    });
  }

  filterTrips(filer: string, startDate: string, endDate: string, minPrice: string, maxPrice: string) {
    this.api.getAllTrips$.subscribe(trips => this.trips = trips
      .filter(trip => trip.name.toLowerCase().includes(filer.toLowerCase()) || trip.location.toLowerCase().includes(filer.toLowerCase()))
      .filter(trip => startDate ? trip.startDate.toDate() >= new Date(startDate) : true)
      .filter(trip => endDate ? trip.endDate.toDate() <= new Date(endDate) : true)
      .filter(trip => minPrice ? trip.price >= this.recalculatePrice(+minPrice) : true)
      .filter(trip => maxPrice ? trip.price <= this.recalculatePrice(+maxPrice) : true)
    );
  }

  calculatePrice(price: number) {
    return this.currency.multiplier * price;
  }

  recalculatePrice(calculatedPrice: number) {
    return calculatedPrice / this.currency.multiplier;
  }

  incrementOrderCount(count: number, trip: Trip) {
    if (count >= trip.availableTickets) {
      return count.toString();
    }
    return (count + 1).toString();
  }

  decrementOrderCount(count: number) {
    if (count <= 0) {
      return count.toString();
    }
    return (count - 1).toString();
  }

  async addItemToCart(trip: Trip, count: number) {
    if (count <= 0 || count > trip!.availableTickets) {
      return;
    }
    await this.api.updateItemInCart(this.userId!, trip.id, count);

    var newTrip = trip;
    newTrip.availableTickets -= count;
    await this.api.updateTrip(newTrip);
  }
}

