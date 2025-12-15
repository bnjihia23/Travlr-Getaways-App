import { Injectable, inject, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BROWSER_STORAGE } from '../storage';

export interface Trip {
  _id?: string;
  code: string;
  name: string;
  length: string;
  start: string;
  resort: string;
  perPerson: string;
  image: string;
  description: string[];
}

@Injectable({ providedIn: 'root' })
export class TripData {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/trips';

  constructor(@Inject(BROWSER_STORAGE) private storage: Storage) {}

  // ----- public GETs -----
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.baseUrl);
  }

  getTripByCode(code: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/${encodeURIComponent(code)}`);
  }
 
  getTrip(code: string) {
  return this.getTripByCode(code);
}

  // ----- helper: auth header -----
  private authHeaders(): HttpHeaders {
    const token = this.storage.getItem('travlr-token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ----- protected writes -----
  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.baseUrl, trip, { headers: this.authHeaders() });
  }

  updateTrip(code: string, trip: Partial<Trip>): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/${encodeURIComponent(code)}`, trip, { headers: this.authHeaders() });
  }

  deleteTrip(code: string): Observable<Trip> {
    return this.http.delete<Trip>(`${this.baseUrl}/${encodeURIComponent(code)}`, { headers: this.authHeaders() });
  }
}
