import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements AfterViewInit {
  cars: any[] = [];
  filteredCars: any[] = [];
  userRole: string | null = null;
  agencyId: number | null = null;

  nameFilter: string = '';
  governorateFilter: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  tunisianGovernorates: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
    'Kasserine', 'Kebili', 'Kef', 'Mahdia', 'Manouba', 'Médenine', 'Monastir',
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur',
    'Tunis', 'Zaghouan'
  ];

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  ngAfterViewInit(): void {
    this.setUserRole();
    this.loadCars();
    this.cdr.detectChanges();
  }

  setUserRole(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.userRole = user.role;
      this.agencyId = user.id;
    }
  }

  loadCars(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    if (this.userRole === 'AGENCE' && this.agencyId) {
      fetch(`http://localhost:9999/agency/${this.agencyId}/cars`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        this.cars = data;
        this.applyFilters();
      })
      .catch(error => console.error('Error loading cars', error));
    } else if (this.userRole === 'CLIENT') {
      this.fetchAvailableCarsFromBackend();
    }
  }

  fetchAvailableCarsFromBackend(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    const params = new URLSearchParams();
    if (this.governorateFilter) params.append('gov', this.governorateFilter);
    if (this.nameFilter) params.append('brand', this.nameFilter);
    if (this.minPrice !== null) params.append('minPrice', this.minPrice.toString());
    if (this.maxPrice !== null) params.append('maxPrice', this.maxPrice.toString());

    fetch(`http://localhost:9999/agency/cars/available?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      this.filteredCars = data;
    })
    .catch(error => console.error('Error fetching available cars', error));
  }

  applyFilters(): void {
    if (this.userRole === 'AGENCE') {
      this.filteredCars = this.cars.filter(car => {
        const nameMatch = `${car.brand} ${car.model}`.toLowerCase().includes(this.nameFilter.toLowerCase());
        const govMatch = this.governorateFilter ? car.governorate === this.governorateFilter : true;
        return nameMatch && govMatch;
      });
    } else if (this.userRole === 'CLIENT') {
      this.fetchAvailableCarsFromBackend();
    }
  } 


  rentCar(carId: number, pricePerDay: number) {
  this.router.navigate(['/locations'], {
    queryParams: {
      carId: carId,
      pricePerDay: pricePerDay
    }
  });
}


showMyLocationCars() {
  const user = localStorage.getItem('user');
  if (user) {
    const clientId = JSON.parse(user).id;
    this.router.navigate(['/locationCarsClient', clientId]);
  } else {
    console.error('No user found in localStorage');
  }
}

showLocationCarsAgency() {
  const user = localStorage.getItem('user');
  if (user) {
    const agencyId = JSON.parse(user).id;
    this.router.navigate(['/locationCarsAgency', agencyId]);
  } else {
    console.error('No user found in localStorage');
  }
}

}
