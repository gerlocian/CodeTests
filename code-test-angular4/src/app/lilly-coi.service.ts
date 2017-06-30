'use strict';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Trial } from './trial.type';

class Options {
  public domain: string;
  public api: string;
}

@Injectable()
export class LillyCoiService {
  readonly NUMBER_RESULTS: number = 100;

  constructor(
    private http: Http,
    private config: Options
  ) {}

  fetchDataForPage(page: number) {
    if (page < 1) throw 'Page number provided is not within the valid range of pages.';

    let offset = (page - 1) * 100;
    return this.http.get(`${this.config.domain}/${this.config.api}?limit=${this.NUMBER_RESULTS}&offset=${offset}`);
  }

}
