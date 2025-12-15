import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripData, Trip } from '../services/trip-data';
import { TripCard } from '../trip-card/trip-card';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})

export class TripListing implements OnInit {
  private tripsApi = inject(TripData);
  private auth = inject(Authentication);

  trips: Trip[] = [];
  loading = false;
  error = '';

  

  ngOnInit(): void {
    this.loading = true;
    this.tripsApi.getTrips().subscribe({
      next: (data) => { this.trips = data || []; this.loading = false; },
      error: (err) => { console.error(err); this.error = 'Failed to load trips'; this.loading = false; }
    });
  }

  isLoggedIn() { return this.auth.isLoggedIn(); }
}

