import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-cars-client',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './location-cars-client.component.html',
  styleUrls: ['./location-cars-client.component.css']
})
export class LocationCarsClientComponent implements OnInit {
  clientId: number | null = null;
  locations: any[] = [];
  uniqueGovernates: string[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.clientId = user.id;
      this.fetchClientLocations();
    }
  }


  extractUniqueGovernates(data: any[]): void {
    this.uniqueGovernates = [...new Set(data.map(location => location.car.gov))];
  }


  
  fetchClientLocations(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    // Récupération des locations du client
    this.http.get<any[]>(`http://localhost:9999/locations/client/${this.clientId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe(
      (data) => {
        this.locations = data;

        // Pour chaque location, récupérer la voiture associée
        this.locations.forEach((location, index) => {
          this.http.get<any>(`http://localhost:9999/agency/car/${location.carId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).subscribe(
            (carData) => {
              this.locations[index].car = carData;
            },
            (error) => {
              console.error(`Erreur lors de la récupération de la voiture ${location.carId}`, error);
            }
          );
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des locations', error);
      }
    );
  }
}
