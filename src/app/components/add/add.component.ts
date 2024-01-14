import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);

  form: FormGroup = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),

    availableTickets: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    shortDescription: new FormControl(''),
    imgs: new FormControl(''),

    location: new FormControl(''),
    mapSrc: new FormControl(''),

    price: new FormControl(''),
  });

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

      availableTickets: [ 
        '', 
        [Validators.required, Validators.min(1)]
      ],
      name: [ 
        '', 
        [Validators.required, Validators.minLength(3), Validators.maxLength(25)]
      ],
      description: [ 
        '', 
        [Validators.required, Validators.minLength(20)]
      ],
      shortDescription: [ 
        '', 
        [Validators.required, Validators.minLength(20), Validators.maxLength(300)]
      ],
      imgs: ['', Validators.required], 

      location: [ 
        '', 
        [Validators.required, Validators.minLength(2)]
      ],
      mapSrc: ['', Validators.required], 

      price: [ 
        '', 
        [Validators.required, Validators.min(1)]],
    });
  }

  get f() {
    return this.form.controls; 
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);

    await this.api.addNewTrip({...this.form.value, 
      imgs: this.handleImgs(), 
      startDate: this.handleDateToTimestamp(this.form.value.startDate), 
      endDate: this.handleDateToTimestamp(this.form.value.endDate)});
  }

  handleImgs(): string[] {
    return this.form.value.imgs.split(',').map((img: string) => img.trim());
  }

  handleDateToTimestamp(date: string): Timestamp {
    return Timestamp.fromDate(new Date(date));
  }
}
