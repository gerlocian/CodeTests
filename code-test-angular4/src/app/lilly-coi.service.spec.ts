'use strict';

import { TestBed, inject } from '@angular/core/testing';

import { LillyCoiService } from './lilly-coi.service';

describe('LillyCoiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LillyCoiService]
    });
  });

  it('should be created', inject([LillyCoiService], (service: LillyCoiService) => {
    expect(service).toBeTruthy();
  }));

  it('should have a method for getting results for a page', inject([LillyCoiService], (service: LillyCoiService) => {
    expect(service.getDataForPage).toBeDefined();
  }));
});
