import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorMasterDialogBoxComponent } from './doctor-master-dialog-box.component';

describe('DoctorMasterDialogBoxComponent', () => {
  let component: DoctorMasterDialogBoxComponent;
  let fixture: ComponentFixture<DoctorMasterDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorMasterDialogBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorMasterDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
