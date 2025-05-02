import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent {
  brand = '';
  model = '';
  releaseDate = '';
  pricePerDay: number | null = null;
  images: File[] = [];

  submitted = false;
  success = false;
  error: string | null = null;

  constructor(private router: Router) {}

  onFileChange(event: any) {
    this.images = Array.from(event.target.files);
  }

  addCar() {
    this.submitted = true;

    // Validation manuelle
    if (!this.brand || !this.model || !this.releaseDate || !this.pricePerDay || this.pricePerDay <= 0) {
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const agencyId = user?.id;
    const governorate = user?.governorate;

    if (!agencyId || !governorate) {
      this.error = "Informations de l'utilisateur manquantes.";
      this.showToast('error');
      return;
    }

    const formData = new FormData();
    formData.append('brand', this.brand);
    formData.append('model', this.model);
    formData.append('releaseDate', this.releaseDate);
    formData.append('pricePerDay', this.pricePerDay?.toString() || '');
    formData.append('userId', agencyId);
    for (let img of this.images) {
      formData.append('imageUrls', img);
    }

    fetch('http://localhost:9999/agency/addcar', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de la voiture.');
      }
      return response.json();
    })
    .then(() => {
      this.success = true;
      this.error = null;
      this.showToast('success');
      setTimeout(() => {
        this.router.navigate(['/cars']);
      }, 3000);
    })
    .catch(err => {
      this.success = false;
      this.error = err.message;
      this.showToast('error');
    });
  }

  showToast(type: 'success' | 'error') {
    setTimeout(() => {
      if (type === 'success') this.success = false;
      if (type === 'error') this.error = null;
    }, 3000);
  }
}
