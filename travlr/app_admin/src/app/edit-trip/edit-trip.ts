import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TripData, Trip } from '../services/trip-data';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-trip.html',
  styleUrls: []
})
export class EditTrip implements OnInit {
  private fb = inject(FormBuilder);
  private trips = inject(TripData);
  private router = inject(Router);

  tripCode = localStorage.getItem('tripCode') || '';
  error = '';
  loading = false;

  form = this.fb.group({
    name: ['', Validators.required],
    length: ['', Validators.required],
    start: ['', Validators.required],
    resort: ['', Validators.required],
    perPerson: ['', Validators.required],
    image: [''],
    description: ['']
  });

  ngOnInit(): void {
    if (!this.tripCode) { this.error = 'No trip selected to edit.'; return; }
    this.loading = true;
    this.trips.getTrip(this.tripCode).subscribe({
      next: (t: Trip) => {
        this.form.patchValue({
          name: t.name,
          length: t.length,
          start: (t.start || '').toString().slice(0,10),
          resort: t.resort,
          perPerson: t.perPerson,
          image: t.image || '',
          description: (t.description || []).join('\n')
        });
        this.loading = false;
      },
      error: (err) => { console.error(err); this.error = 'Failed to load trip'; this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid || !this.tripCode) { this.form.markAllAsTouched(); return; }
    const v: any = { ...this.form.value };
    v.description = (v.description || '').split('\n').filter((s: string) => s.trim().length);
    this.trips.updateTrip(this.tripCode, v).subscribe({
      next: () => { localStorage.removeItem('tripCode'); this.router.navigate(['/']); },
      error: (err) => { console.error(err); this.error = 'Failed to update trip'; }
    });
  }
}
