import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentMasterDialogBoxComponent } from './department-master-dialog-box.component';

describe('DepartmentMasterDialogBoxComponent', () => {
  let component: DepartmentMasterDialogBoxComponent;
  let fixture: ComponentFixture<DepartmentMasterDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentMasterDialogBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartmentMasterDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
