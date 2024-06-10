import { TestBed } from '@angular/core/testing';

import { DoctorMasterService } from './doctor-master.service';

describe('DoctorMasterService', () => {
  let service: DoctorMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
