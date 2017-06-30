'use strict';

import { TestBed, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, HttpModule, BaseRequestOptions, ResponseOptions, Response } from '@angular/http';
import { LillyCoiService } from './lilly-coi.service';
import { ServiceApiOptions } from './service-api-options.type';

describe('LillyCoiService', () => {
  let service: LillyCoiService;
  let backend: MockBackend;
  let http: Http;
  let spy: any;
  let serviceOptions: ServiceApiOptions;
  let expectedResults;

  beforeEach(() => {
    serviceOptions = new ServiceApiOptions('http://example.com', 'api');

    expectedResults = {
      "results": [{ "brief_title": "My brief title", "sponsors": { "lead_sponsor": "Patrick Ortiz" }, "completion_date": { "attributes": { "type": "Actual" }, "value": "June 1987" }}],
      "resultCount": 1,
      "totalCount": 1,
      "nextPageUri": `${serviceOptions.domain}/${serviceOptions.apiPath}?limit=100&offset=100`,
      "previousPageUri": null
    };

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: ServiceApiOptions,
          useValue: serviceOptions
        },
        {
          provide: Http,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
          deps: [ MockBackend, BaseRequestOptions ]
        },
        {
          provide: LillyCoiService,
          useFactory: (http: Http, options: ServiceApiOptions) => new LillyCoiService(http, options),
          deps: [ Http, ServiceApiOptions ]
        }
      ]
    });

    service = TestBed.get(LillyCoiService);
    backend = TestBed.get(MockBackend);
    http = TestBed.get(Http);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('method fetchDataForPage', () => {
    it('should exist',  () => {
      expect(service.fetchDataForPage).toBeDefined();
    });

    it('should fire the "get" method on the http service when data is requested', () => {
      spy = spyOn(http, 'get').and.returnValue(null);
      service.fetchDataForPage(1);
      expect(http.get).toHaveBeenCalledWith(`${serviceOptions.domain}/${serviceOptions.apiPath}?limit=100&offset=0`);
    });

    it('should calculate the correct offset based on page number', () => {
      spy = spyOn(http, 'get').and.returnValue(null);
      service.fetchDataForPage(4);
      expect(http.get).toHaveBeenCalledWith(`${serviceOptions.domain}/${serviceOptions.apiPath}?limit=100&offset=300`);

      service.fetchDataForPage(10);
      expect(http.get).toHaveBeenCalledWith(`${serviceOptions.domain}/${serviceOptions.apiPath}?limit=100&offset=900`);

      service.fetchDataForPage(20);
      expect(http.get).toHaveBeenCalledWith(`${serviceOptions.domain}/${serviceOptions.apiPath}?limit=100&offset=1900`);
    });

    it('should throw exception if the page number provided is less than 1', () => {
      spy = spyOn(http, 'get').and.returnValue(null);

      expect(() => { service.fetchDataForPage(0); }).toThrow();
      expect(() => { service.fetchDataForPage(-199); }).toThrow();
      expect(http.get).not.toHaveBeenCalled();
    });

    it('should return the data from the result', (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({ body: expectedResults });
        connection.mockRespond(new Response(options));
      });

      service.fetchDataForPage(1).subscribe((response: Response) => {
        let res = JSON.parse(response.text());
        expect(res.resultCount).toEqual(expectedResults.resultCount);
        expect(res.totalCount).toEqual(expectedResults.totalCount);
        expect(res.nextPageUri).toEqual(expectedResults.nextPageUri);
        expect(res.previousPageUri).toEqual(expectedResults.previousPageUri);
        expect(res.results[0].brief_title).toEqual(expectedResults.results[0].brief_title);
        done();
      });
    });
  });
});
