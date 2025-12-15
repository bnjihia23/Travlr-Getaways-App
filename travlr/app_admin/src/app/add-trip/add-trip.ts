import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-trip.html',
  styleUrls: []
})
export class AddTrip {
  private fb = inject(FormBuilder);
  private trips = inject(TripData);
  private router = inject(Router);

  form = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    length: ['7 nights', Validators.required],
    start: ['', Validators.required],               
    resort: ['', Validators.required],
    perPerson: ['0', Validators.required],
    image: ['reef1.jpg', Validators.required],
    description: ['']                                
  });

  error = '';

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v: any = { ...this.form.value };
    v.description = (v.description || '').split('\n').filter((s: string) => s.trim().length);
    this.trips.addTrip(v).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => { console.error(err); this.error = 'Failed to add trip'; }
    });
  }
}
