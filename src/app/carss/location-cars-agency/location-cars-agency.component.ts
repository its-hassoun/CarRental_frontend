import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-cars-agency',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './location-cars-agency.component.html',
  styleUrls: ['./location-cars-agency.component.css']
})
export class LocationCarsAgencyComponent implements OnInit {
  agencyId: number | null = null;
  locations: any[] = [];
  
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.agencyId = user.id;
      this.fetchAgencyLocations();
    }
  }

  fetchAgencyLocations(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    // Fetching the locations for the agency
    this.http.get<any[]>(`http://localhost:9999/locations/agency/${this.agencyId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe(
      (data) => {
        this.locations = data;

        // For each location, fetch the associated car details
        this.locations.forEach((location, index) => {
          this.http.get<any>(`http://localhost:9999/agency/car/${location.carId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).subscribe(
            (carData) => {
              this.locations[index].car = carData;
            },
            (error) => {
              console.error(`Error fetching car ${location.carId}`, error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching agency locations', error);
      }
    );
  }
}
