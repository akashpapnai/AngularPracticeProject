import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrandpayrollComponent } from './hrandpayroll.component';

describe('HrandpayrollComponent', () => {
  let component: HrandpayrollComponent;
  let fixture: ComponentFixture<HrandpayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrandpayrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HrandpayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
