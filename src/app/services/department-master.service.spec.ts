import { TestBed } from '@angular/core/testing';

import { DepartmentMasterService } from './department-master.service';

describe('DepartmentMasterService', () => {
  let service: DepartmentMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
