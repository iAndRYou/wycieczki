import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  authService: AuthService = inject(AuthService);
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  errorMessage: string | undefined;

  form: FormGroup = new FormGroup({
    username: new FormControl(
      '', 
      [Validators.required, Validators.minLength(3)]
    ),
    email: new FormControl(
      '', 
      [Validators.required, Validators.email]
    ),
    password: new FormControl(
      '', 
      [Validators.required, Validators.minLength(6)]
    ),
  });

  get f() {
    return this.form.controls; 
  }

  async onSubmit() {
    if (this.form.invalid) return;

    try {
      const { username, email, password } = this.form.value;
      await this.authService.register(username, email, password);
      this.router.navigate(['/']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.errorMessage = error.message;
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
