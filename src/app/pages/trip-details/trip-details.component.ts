import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Trip } from '../../interfaces/trip.interface';
import { ApiService } from '../../services/api.service';
import { CarouselModule } from 'ngx-bootstrap/carousel'
import { RatingComponent } from '../../components/rating/rating.component';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { Currency } from '../../interfaces/currency.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterLink, RatingComponent, SafeHtmlPipe],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css'
})
export class TripDetailsComponent implements OnInit {
  userId: string = '';
  id: string = '';
  count: number = 0;
  router: Router = inject(Router);
  public trip: Trip = {} as Trip;
  currency: Currency = {} as Currency;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id') as string;
  }

  ngOnInit(): void {
    this.api.getTrip$(this.id).subscribe(trip => this.trip = trip);
    this.api.currency$.subscribe(currency => this.currency = currency);
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  calculatePrice() {
    return this.currency.multiplier * this.trip.price;
  }

  incrementOrderCount() {
    if (this.count < this.trip.availableTickets) this.count = this.count + 1;
  }

  decrementOrderCount() {
    if (this.count > 0) this.count = this.count - 1;
  }

  async addItemToCart() {
    if (this.count <= 0 || this.count > this.trip.availableTickets) return;

    await this.api.updateItemInCart(this.userId, this.id, this.count);

    var newTrip = this.trip;
    newTrip.availableTickets -= this.count;
    await this.api.updateTrip(newTrip);

    this.count = 0;
  }
}
