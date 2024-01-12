import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { PreloadingService } from './services/preloading.service';
import { ApiService } from './services/api.service';
import { Currency } from './interfaces/currency.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  providers: [AuthService, PreloadingService, ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  apiService: ApiService = inject(ApiService);
  currency: Currency = {} as Currency;

  ngOnInit() {
    this.apiService.currency$.subscribe(currency => this.currency = currency);
  }

  get authState$() {
    return this.authService.authState$;
  }

  async logout() {
    await this.authService.logout();
  }

  setCurrency(currency: string) {
    this.apiService.changeCurrency(currency);
  }
}
