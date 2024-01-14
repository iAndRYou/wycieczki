import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from '../../interfaces/cart-item.interface';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Trip } from '../../interfaces/trip.interface';
import { Currency } from '../../interfaces/currency.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  @Input() type: 'default' | 'menu' | 'float' = 'default';
  
  userId: string | undefined = '';
  cart: CartItem[] = [];
  trips: Trip[] = [];
  currency: Currency = {} as Currency;

  constructor(
    private api: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.api.getCart$(this.userId).subscribe(cart => {
          // Update cart
          this.cart = cart;
          this.cart.forEach(cartItem => {
            this.api.getTrip$(cartItem.tripId).subscribe(gotTrip => {
              if (this.trips.findIndex(t => t.id === gotTrip.id) === -1) {
                this.trips.push(gotTrip);
              }
            });
          });
        });
      } else {
        this.userId = undefined;
      }
    });

    this.api.currency$.subscribe(currency => this.currency = currency);

    this.api.getAllTrips$.subscribe(gotTrips => {
      // Update trips
      gotTrips.forEach(gotTrip => {
        var index = this.trips.findIndex(t => t.id === gotTrip.id);
        if (index !== -1) {
          this.trips[index] = gotTrip;
        }
      });

      // Remove trips that were deleted
      this.trips.forEach(async (trip) => {
        var index = gotTrips.findIndex(t => t.id === trip.id);
        if (index === -1) {
          await this.removeItem(index);
        }
      });
    });
  }

  get totalItems(): number {
    return this.cart.reduce((total, cartItem) => {
      return total + cartItem.quantity;
    }, 0);
  }

  get totalSelectedItems(): number {
    return this.cart.reduce((total, cartItem) => {
      return total + (cartItem.selected? cartItem.quantity : 0);
    }, 0);
  }

  get totalTripsPrice(): number {
    return this.cart.reduce((total, cartItem) => {
      return total + cartItem.quantity * this.trips.find(trip => trip.id === cartItem!.tripId)!.price;
    }, 0);
  }

  get totalSelectedTripsPrice(): number {
    return this.cart.reduce((total, cartItem) => {
      return total + (cartItem.selected? cartItem.quantity * this.trips.find(trip => trip.id === cartItem!.tripId)!.price : 0);
    }, 0);
  }

  calculatePrice(price: number): number {
    return this.currency.multiplier * price;
  }

  async changeAvailableTickets(index: number, value: number) {
    var trip = this.trips[index];
    trip.availableTickets += value;
    await this.api.updateTrip(trip);
  }

  async addItem(index: number) {
    if (this.trips[index].availableTickets > 0) await this.api.updateItemInCart(this.userId!, this.cart[index].tripId, 1, this.cart[index].selected);

    await this.changeAvailableTickets(index, -1);  
    console.log(this.trips);
  }

  async subtractItem(index: number) {
    await this.changeAvailableTickets(index, 1);

    if (this.cart[index].quantity === 1) await this.removeItem(index);
    else await this.api.updateItemInCart(this.userId!, this.cart[index].tripId, -1, this.cart[index].selected);
  }

  async buyItem(index: number) {
    await this.api.buyItemFromCart(this.userId!, this.cart[index]);
  }

  async buySelectedItems() {
    this.cart.forEach(async (cartItem, index) => {
      if (cartItem.selected) await this.buyItem(index);
    });
  }

  async removeItem(index: number) {
    await this.api.removeItemFromCart(this.userId!, this.cart[index]);
    this.trips.splice(index, 1);
  }

  async switchSelectItem(index: number) {
    await this.api.updateItemInCart(this.userId!, this.cart[index].tripId, 0, !this.cart[index].selected);
  }
}
