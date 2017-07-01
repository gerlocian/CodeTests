'use strict';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ServiceApiOptions } from './service-api-options.type';

@Injectable()
export class LillyCoiService {
  constructor(
    private http: Http,
    private config: ServiceApiOptions
  ) {}

  getData(): Observable<object> {
    return this.http.get(`${this.config.domain}${this.config.port ? this.config.port : ''}/${this.config.apiPath}?limit=100`);
  }
}
