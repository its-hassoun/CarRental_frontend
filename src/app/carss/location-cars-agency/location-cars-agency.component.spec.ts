import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCarsAgencyComponent } from './location-cars-agency.component';

describe('LocationCarsAgencyComponent', () => {
  let component: LocationCarsAgencyComponent;
  let fixture: ComponentFixture<LocationCarsAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationCarsAgencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationCarsAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
