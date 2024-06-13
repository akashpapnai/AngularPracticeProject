import { TestBed } from '@angular/core/testing';

import { EmployeeMasterService } from './employee-master.service';

describe('EmployeeMasterService', () => {
  let service: EmployeeMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
