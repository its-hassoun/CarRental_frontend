import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userRole: string = ''; // Initialize userRole
  agencyId: string = ''; // Initialize agencyId

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.setUserRole(); // Set the user role when the component is initialized
  }

  // Method to retrieve the user role from localStorage
  setUserRole(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.userRole = user.role;
      this.agencyId = user.id;

      // Manually trigger change detection to ensure the view updates
      this.cdr.detectChanges();
    }
  }

  // Method to log the user out and clear local storage
  logout() {
    localStorage.clear(); // or you can use localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
