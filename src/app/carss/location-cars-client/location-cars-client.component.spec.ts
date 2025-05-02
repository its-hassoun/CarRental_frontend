import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCarsClientComponent } from './location-cars-client.component';

describe('LocationCarsClientComponent', () => {
  let component: LocationCarsClientComponent;
  let fixture: ComponentFixture<LocationCarsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationCarsClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationCarsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
