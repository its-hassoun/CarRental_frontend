import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-car',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.css']
})
export class UpdateCarComponent implements OnInit {
  carId: number | null = null;
  car: any = {
    brand: '',
    model: '',
    releaseDate: '',
    pricePerDay: 0
  };
  selectedImages: File[] = [];
  error: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
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
      Object.assign(this.car, data);
      console.log('Car details for editing:', this.car);
    })
    .catch(err => {
      this.error = err.message;
      console.error('Error fetching car details:', err);
    });
  }

  onImageChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (files.length > 5) {
        alert("You can't upload more than 5 images.");
        this.selectedImages = [];
      } else {
        this.selectedImages = Array.from(files);
      }
    }
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'Authorization token missing.';
      return;
    }

    const formData = new FormData();
    formData.append('brand', this.car.brand.trim());
    formData.append('model', this.car.model.trim());
    formData.append('releaseDate', this.car.releaseDate);
    formData.append('pricePerDay', this.car.pricePerDay.toString());

    this.selectedImages.forEach((image) => {
      formData.append('imageFiles', image); // must match Spring DTO
    });

    fetch(`http://localhost:9999/agency/car/${this.carId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to update car details.');
      }
      return res.json();
    })
    .then(updatedCar => {
      this.car = { ...updatedCar };
      alert('Car updated successfully!');
      this.router.navigate(['/cars']);
    })
    .catch(err => {
      this.error = err.message;
      console.error('Error updating car details:', err);
    });
  }
}
