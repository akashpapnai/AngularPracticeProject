import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdPatientsReportComponent } from './opd-patients-report.component';

describe('OpdPatientsReportComponent', () => {
  let component: OpdPatientsReportComponent;
  let fixture: ComponentFixture<OpdPatientsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpdPatientsReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpdPatientsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
