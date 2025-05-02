import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  carId!: number;
  clientId: number | null = null;
  startDate!: string;
  endDate!: string;
  totalAmount: number | null = null;
  pricePerDay: number = 0;

  successMessage = '';
  errorMessage = '';
  showAmount = false;
  isRenting = false; // Flag to track the renting state
  today: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}


ngOnInit(): void {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    this.clientId = user.id;
  }

  // Récupère la date d'aujourd'hui au format 'yyyy-MM-dd'
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const day = String(todayDate.getDate()).padStart(2, '0');
  this.today = `${year}-${month}-${day}`;

  this.route.queryParams.subscribe(params => {
    this.carId = +params['carId'];
    this.pricePerDay = +params['pricePerDay'];
  });
}


  calculateAmount() {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = "Please select both start and end dates!";
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      if (end < start) {
        this.errorMessage = "End date cannot be before the start date!";
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      } else {
        const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        if (days < 1) {
          this.errorMessage = "The rental period must be at least 1 day!";
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        } else {
          this.totalAmount = days *  this.pricePerDay;
          this.successMessage = `Rental period calculated: ${days} day(s)`;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
          this.showAmount = true;
        }
      }
    }
  }

  rentCar() {
    this.isRenting = true; // Set the flag to true when "Rent Now" is clicked

    if (!this.showAmount) {
      this.errorMessage = 'Please choose valid start and end dates to calculate the amount first.';
      return;
    }

    const request = {
      carId: this.carId,
      clientId: this.clientId,
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.http.post<any>('http://localhost:9999/locations', request).subscribe({
      next: (response) => {
        this.successMessage = 'Car successfully rented!';
        this.errorMessage = '';
        this.showAmount = false;
        this.totalAmount = null;

        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/cars']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error:', err);
        this.successMessage = '';
        this.errorMessage = 'Failed to rent the car. Please try again.';
      }
    });
  }
}
