import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  chosenCurrency$: Observable<string> = of('USD');

  setCurrency(currency: string) {
    this.chosenCurrency$ = of(currency);
  }

  calculatePrice$(price: number): Observable<number> {
    return this.chosenCurrency$.pipe(
      switchMap(currency => {
        switch (currency) {
          case 'USD':
            return of(+environment.currencies.USD * price);
          case 'EUR':
            return of(+environment.currencies.EUR * price);
          case 'GBP':
            return of(+environment.currencies.GBP * price);
          case 'PLN':
            return of(+environment.currencies.PLN * price);
          default:
            return of(1);
        }
      })
    );
  }
}
