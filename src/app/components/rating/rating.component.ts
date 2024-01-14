import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Trip } from '../../interfaces/trip.interface';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  @Input() trip: Trip = {} as Trip;
  @Input() value: number | undefined = 0;
  @Input() type: 'read-only' | 'editable' | 'label' = 'read-only';

  apiService = inject(ApiService);
  authService = inject(AuthService);
  userId: string | undefined = '';
  hovering: number = 0;

  ngOnInit(): void {
    if (this.type === 'editable') {
      this.authService.authState$.subscribe(user => {
        if (user) {
          this.userId = user.uid;
        } else {
          this.userId = undefined;
        }
      });
    }
  }

  get getRating(): number {
    if (this.ratingsNumber === undefined || this.ratingsNumber === 0) {
      return this.value || 0;
    }
    return this.trip.ratings.reduce((acc, rating) => acc + rating.rating, 0) / this.ratingsNumber;
  }

  get ratingsNumber(): number {
    return this.trip.ratings ? this.trip!.ratings.length : 0;
  }

  get stars(): number[] {
    return Array(Math.floor(this.getRating)).fill(0);
  }

  get halfStar(): boolean {
    return this.getRating % 1 !== 0;
  }

  get emptyStars(): number[] {
    return Array(5 - Math.ceil(this.getRating)).fill(0);
  }

  ifAlreadyRated(): boolean {
    return this.trip.ratings?.some(rating => rating.userId === this.userId);
  }

  userRating(): number {
    var rating = this.trip.ratings?.find(rating => rating.userId === this.userId);
    return rating ? rating.rating : 0;
  }

  async rateTrip(rating: number) {
    if (this.ifAlreadyRated()) return;
    
    if (this.trip.ratings === undefined) this.trip.ratings = [];

    var userRating = {userId: this.userId, rating: rating};
    var updatedTrip = {...this.trip, ratings: [...this.trip.ratings, userRating]} as Trip;
    
    await this.apiService.updateTrip(updatedTrip);
  }
}
