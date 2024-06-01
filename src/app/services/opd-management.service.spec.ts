import { TestBed } from '@angular/core/testing';

import { OpdManagementService } from './opd-management.service';

describe('OpdManagementService', () => {
  let service: OpdManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpdManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
