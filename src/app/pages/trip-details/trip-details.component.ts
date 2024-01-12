import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Trip } from '../../interfaces/trip.interface';
import { ApiService } from '../../services/api.service';
import { CurrencyService } from '../../services/currency.service';
import { Observable } from 'rxjs';
import { CarouselModule } from 'ngx-bootstrap/carousel'
import { RatingComponent } from '../../components/rating/rating.component';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

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

  constructor(
    private api: ApiService,
    private currencyService: CurrencyService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id') as string;
  }

  ngOnInit(): void {
    this.api.getTrip$(this.id).subscribe(trip => this.trip = trip);
  }

  get currency$(): Observable<string> {
    return this.currencyService.chosenCurrency$;
  }

  calculatePrice$(price: number) {
    return this.currencyService.calculatePrice$(price);
  }
}
