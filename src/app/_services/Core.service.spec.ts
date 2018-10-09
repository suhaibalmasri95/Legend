/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreService } from './CoreServices.service';

describe('Service: CoreServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreService]
    });
  });

  it('should ...', inject([CoreService], (service: CoreService) => {
    expect(service).toBeTruthy();
  }));
});
