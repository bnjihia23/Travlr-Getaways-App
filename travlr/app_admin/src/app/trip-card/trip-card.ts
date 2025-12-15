import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripData, Trip } from '../services/trip-data';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrls: []
})
export class TripCard {
  @Input() trip!: Trip;
  private router = inject(Router);
  private tripData = inject(TripData);
  private auth = inject(Authentication);

  isLoggedIn() { return this.auth.isLoggedIn(); }

  editTrip(): void {
    localStorage.setItem('tripCode', this.trip.code);
    this.router.navigate(['/edit-trip']);
  }

  deleteTrip(): void {
    if (!confirm(`Delete ${this.trip.name} (${this.trip.code})?`)) return;
    this.tripData.deleteTrip(this.trip.code).subscribe({
      next: () => location.reload(),
      error: (err) => console.error(err)
    });
  }
}