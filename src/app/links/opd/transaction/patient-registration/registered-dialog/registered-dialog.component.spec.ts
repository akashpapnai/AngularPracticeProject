import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredDialogComponent } from './registered-dialog.component';

describe('RegisteredDialogComponent', () => {
  let component: RegisteredDialogComponent;
  let fixture: ComponentFixture<RegisteredDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisteredDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
