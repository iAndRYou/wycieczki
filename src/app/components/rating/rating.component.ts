import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Rating } from '../../interfaces/rating.interface';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {
  @Input() ratings: Rating[] | undefined = [];
  @Input() value: number | undefined = 0;
  @Input() type: 'read-only' | 'editable' | 'label' = 'read-only';

  get getRating(): number {
    if (this.ratingsNumber === undefined || this.ratingsNumber === 0) {
      return this.value || 0;
    }
    return this.ratings!.reduce((acc, rating) => acc + rating.rating, 0) / this.ratingsNumber;
  }

  get ratingsNumber(): number {
    return this.ratings!.length;
  }

  get stars(): number[] {
    return Array(Math.floor(this.getRating)).fill(0);
  }

  rate(rating: number) {
    console.log(`Rating ${rating} was selected`);
  }
}
