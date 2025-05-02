import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import RouterModule and Router

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],  // Include RouterModule in imports
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showSuccessPopup: boolean = false;
  
  constructor(private router: Router) {}

  ngOnInit() {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      // Check if login was successful
      if (localStorage.getItem('loginSuccess') === 'true') {
        this.showSuccessPopup = true;
        // Remove the flag after showing the pop-up
        localStorage.removeItem('loginSuccess');
        
        // Set a timeout to hide the success pop-up after a few seconds
        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000); 
      }
    }
  }
}
