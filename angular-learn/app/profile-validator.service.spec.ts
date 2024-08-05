import { TestBed } from '@angular/core/testing';

import { ProfileValidatorService } from './profile-validator.service';

describe('ProfileValidatorService', () => {
  let service: ProfileValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
