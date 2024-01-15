import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Trip } from '../../interfaces/trip.interface';
import { Timestamp } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.css'
})
export class AddReviewComponent implements OnInit {
  @Input() trip: Trip = {} as Trip;
  fb: FormBuilder = inject(FormBuilder);
  api: ApiService = inject(ApiService);

  form: FormGroup = new FormGroup({
    nick: new FormControl(''),
    name: new FormControl(''),
    text: new FormControl(''),
    date: new FormControl(''),
  });

  ngOnInit(): void {
    this.form = this.fb.group({
      nick: ['', Validators.required],
      name: ['', Validators.required],
      text: [
        '',
        [Validators.required, Validators.minLength(50), Validators.maxLength(500)]
      ],
      date: [''],
    });
  }

  get f() {
    return this.form.controls; 
  }

  async onSubmit() {
    if (this.form.invalid) return;

    if (this.trip.reviews === undefined) this.trip.reviews = [];

    var userReview = { ...this.form.value };
    if (userReview.date === '') {
      userReview.date = null;
    } else {
      userReview.date = this.handleDateToTimestamp(userReview.date);
    }

    var updatedTrip = { ...this.trip, reviews: [...this.trip.reviews, userReview] } as Trip;
    await this.api.updateTrip(updatedTrip);

    this.form.reset();
  }

  handleDateToTimestamp(date: string): Timestamp {
    return Timestamp.fromDate(new Date(date));
  }
}
