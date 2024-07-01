import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpdAdmissionComponent } from './ipd-admission.component';

describe('IpdAdmissionComponent', () => {
  let component: IpdAdmissionComponent;
  let fixture: ComponentFixture<IpdAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpdAdmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IpdAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
