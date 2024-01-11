import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { PreloadingService } from './services/preloading.service';
import { AuthGuard } from '@angular/fire/auth-guard';
import { CurrencyService } from './services/currency.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  providers: [AuthService, PreloadingService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  authService: AuthService = inject(AuthService);
  currencyService: CurrencyService = inject(CurrencyService);
  
  get authState$() {
    return this.authService.authState$;
  }

  get chosenCurrency$() {
    return this.currencyService.chosenCurrency$;
  }

  async logout() {
    await this.authService.logout();
  }

  setCurrency(currency: string) {
    this.currencyService.setCurrency(currency);
  }
}
