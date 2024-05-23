import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsRegisteredReportComponent } from './patients-registered-report.component';

describe('PatientsRegisteredReportComponent', () => {
  let component: PatientsRegisteredReportComponent;
  let fixture: ComponentFixture<PatientsRegisteredReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsRegisteredReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientsRegisteredReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
