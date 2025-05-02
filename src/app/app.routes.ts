import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { CarsComponent } from './carss/cars/cars.component';
import { AddCarComponent } from './carss/add-car/add-car.component';
import { ContactComponent } from './contact/contact.component';
import { CarDetailsComponent } from './carss/car-details/car-details.component';
import { UpdateCarComponent } from './carss/update-car/update-car.component';
import { LocationsComponent } from './carss/locations/locations.component';
import { LocationCarsClientComponent } from './carss/location-cars-client/location-cars-client.component';
import { LocationCarsAgencyComponent } from './carss/location-cars-agency/location-cars-agency.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutComponent },
    { path: 'cars', component: CarsComponent },
    { path: 'addCar', component: AddCarComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'car/:carId', component: CarDetailsComponent },
    { path: 'updateCar/:carId', component: UpdateCarComponent },
    { path: 'locations', component: LocationsComponent },
    { path: 'locationCarsClient/:clientId', component: LocationCarsClientComponent },
    { path: 'locationCarsAgency/:agencyId', component: LocationCarsAgencyComponent },
    { path: 'dashboard/:agencyId', component: DashboardComponent }
  
];
