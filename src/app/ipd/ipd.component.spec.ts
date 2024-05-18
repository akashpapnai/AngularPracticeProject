import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpdComponent } from './ipd.component';

describe('IpdComponent', () => {
  let component: IpdComponent;
  let fixture: ComponentFixture<IpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
