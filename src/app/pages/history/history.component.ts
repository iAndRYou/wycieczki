import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HistoryItem } from '../../interfaces/history-item.interface';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Currency } from '../../interfaces/currency.interface';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  history: HistoryItem[] = [];
  currency: Currency = {} as Currency;

  constructor(
    private api: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.api.getHistory$(user.uid).subscribe(history => {
          this.history = history;
        });
      }
    });

    this.api.currency$.subscribe(currency => this.currency = currency);
  }

  calculatePrice(HistoryItem: HistoryItem): number {
    return this.currency.multiplier * HistoryItem.price;
  }

  calculateTotalPrice(historyItem: HistoryItem): number {
    return this.calculatePrice(historyItem) * historyItem.quantity;
  }

  getStatus(historyItem: HistoryItem): string {
    var now = Timestamp.now().toDate();
    var startDate = historyItem.startDateTimestamp.toDate();
    var endDate = historyItem.endDateTimestamp.toDate();

    if (now < startDate) {
      return 'Upcoming';
    } else if (now > endDate) {
      return 'Archived';
    } else {
      return 'Ongoing';
    }
  }

  getStatusColor(historyItem: HistoryItem): string {
    switch (this.getStatus(historyItem)) {
      case 'Upcoming':
        return 'text-info ';
      case 'Archived':
        return 'text-danger ';
      case 'Ongoing':
        return 'text-success ';
      default:
        return 'text-dark ';
    }
  }
}
