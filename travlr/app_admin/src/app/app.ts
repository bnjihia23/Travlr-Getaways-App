import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { Authentication } from './services/authentication';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private auth = inject(Authentication);
  title = 'Travlr Getaways Admin!';

  isLoggedIn() { return this.auth.isLoggedIn(); }
  logout() { this.auth.logout(); }
}
