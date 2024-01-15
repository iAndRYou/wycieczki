import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  errorMessage: string | undefined;

  form: FormGroup = new FormGroup({
    email: new FormControl(
      '', 
      [Validators.required, Validators.email]
    ),
    password: new FormControl(
      '', Validators.required,
    ),
  });

  get f() {
    return this.form.controls; 
  }

  async onSubmit() {
    if (this.form.invalid) return;

    try {
      const { email, password } = this.form.value;
      await this.authService.login(email, password);
      this.router.navigate(['/']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.errorMessage = error.message;
      }
    }
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }
}
