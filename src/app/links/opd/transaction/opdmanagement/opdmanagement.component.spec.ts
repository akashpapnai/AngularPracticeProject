import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdmanagementComponent } from './opdmanagement.component';

describe('OpdmanagementComponent', () => {
  let component: OpdmanagementComponent;
  let fixture: ComponentFixture<OpdmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpdmanagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpdmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
