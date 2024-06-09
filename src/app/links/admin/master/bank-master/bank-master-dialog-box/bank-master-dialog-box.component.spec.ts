import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMasterDialogBoxComponent } from './bank-master-dialog-box.component';

describe('BankMasterDialogBoxComponent', () => {
  let component: BankMasterDialogBoxComponent;
  let fixture: ComponentFixture<BankMasterDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankMasterDialogBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankMasterDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
