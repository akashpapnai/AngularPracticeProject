import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdServiceComponent } from './opd-service.component';

describe('OpdServiceComponent', () => {
  let component: OpdServiceComponent;
  let fixture: ComponentFixture<OpdServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpdServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpdServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
