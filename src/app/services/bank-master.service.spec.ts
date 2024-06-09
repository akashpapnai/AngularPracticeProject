import { TestBed } from '@angular/core/testing';

import { BankMasterService } from './bank-master.service';

describe('BankMasterService', () => {
  let service: BankMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
