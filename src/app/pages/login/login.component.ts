import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  action: 'Login' | 'Sign Up' = 'Login';
  router: Router = inject(Router);

  get isLogin() {
    return this.action === 'Login';
  }

  get isSignup() {
    return this.action === 'Sign Up';
  }

  switchAuthMode() {
    this.action = this.isLogin ? 'Sign Up' : 'Login';
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.isLogin) {
      await this.handleLogin(form);
    } else if (this.isSignup) {
      await this.handleSignup(form);
    }
  }

  async handleLogin(form: NgForm) {
    const { email, password } = form.value;
    try {
      await this.authService.login(email, password);
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
      form.reset();
    }
  }

  async handleSignup(form: NgForm) {
    const { username, email, password } = form.value;
    try {
      await this.authService.register(username, email, password);
    } catch (error) {
      console.log(error);
      form.reset();
    }
  }
}
