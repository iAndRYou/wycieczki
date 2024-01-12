import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Trip } from '../../interfaces/trip.interface';
import { ApiService } from '../../services/api.service';
import { CarouselModule } from 'ngx-bootstrap/carousel'
import { RatingComponent } from '../../components/rating/rating.component';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { Currency } from '../../interfaces/currency.interface';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterLink, RatingComponent, SafeHtmlPipe],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css'
})
export class TripDetailsComponent implements OnInit {
  id: string = '';
  router: Router = inject(Router);
  public trip: Trip = {} as Trip;
  currency: Currency = {} as Currency;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id') as string;
  }

  ngOnInit(): void {
    this.api.getTrip$(this.id).subscribe(trip => this.trip = trip);
    this.api.currency$.subscribe(currency => this.currency = currency);
  }

  calculatePrice(price: number) {
    return this.currency.multiplier * price;
  }
}
