import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {
  carId: number | null = null;
  car: any = null;
  error: string | null = null;
  userRole: string | null = null;  // <-- Ajouté

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Lire le rôle de l'utilisateur depuis le localStorage
    this.userRole = localStorage.getItem('role'); // <-- Assure-toi que la clé est correcte
    this.carId = Number(this.route.snapshot.paramMap.get('carId'));
    if (this.carId) {
      this.fetchCarDetails(this.carId);
    }
  }

  fetchCarDetails(id: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'Authorization token missing.';
      return;
    }

    fetch(`http://localhost:9999/agency/car/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch car details.');
      }
      return res.json();
    })
    .then(data => {
      this.car = data;
      console.log('Car details:', this.car);
    })
    .catch(err => {
      this.error = err.message;
      console.error('Error fetching car details:', err);
    });
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default-car.png'; // fallback image
  }
  
}
