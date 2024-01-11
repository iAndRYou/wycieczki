import { Component, OnInit, inject } from '@angular/core';
import { Observable, filter, map, max, min, of } from 'rxjs';
import { Trip } from '../../interfaces/trip.interface';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../services/currency.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit {
  public trips: Trip[] = [];
  public currency = 'PLN';
  router: Router = inject(Router);

  constructor(
    private api: ApiService,
    private currencyService: CurrencyService
  ) { }

  get getTripsData(): Trip[] {
    return this.trips;
  }

  ngOnInit(): void {
    this.api.getAllTrips$.subscribe(trips => this.trips = trips);
    this.currencyService.chosenCurrency$.subscribe(currency => this.currency = currency);
  }

  update(filer: string) {
    this.api.getAllTrips$.subscribe(trips => this.trips = trips.filter(trip => trip.name.toLowerCase().includes(filer.toLowerCase())));
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

  calculatePrice$(price: number) {
    return this.currencyService.calculatePrice$(price);
  }

  goToSpecified(trip: Trip) {
    this.router.navigate(['/trips', trip.id]);
  }
}

