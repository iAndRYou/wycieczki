import { Component, OnInit } from '@angular/core';
import { AddComponent } from '../../components/add/add.component';
import { ApiService } from '../../services/api.service';
import { Trip } from '../../interfaces/trip.interface';
import { CommonModule } from '@angular/common';
import { Currency } from '../../interfaces/currency.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AddComponent, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  trips: Trip[] = [];
  currency: Currency = {} as Currency;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.api.getAllTrips$.subscribe(trips => {
      this.trips = trips;
      console.log(this.trips);
    }); 

    this.api.currency$.subscribe(currency => {
      this.currency = currency;
    });
  }

  calculatePrice(price: number): number {
    return price * this.currency.multiplier;
  }

  async deleteTrip(trip: Trip) {
    await this.api.deleteTrip(trip);
  }
}
