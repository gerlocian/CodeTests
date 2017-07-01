'use strict';

import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { LillyCoiService } from "./lilly-coi.service";
import { Trial, TrialDate } from './trial.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private lillyCoiData: Array<object>;
  private currentPage: number = 1;
  private totalPages: number;
  private currentSet: Array<object>;
  private numResults: number = 10;

  constructor(
    private lillyCoiService: LillyCoiService
  ) {}

  setNumResults(numResults: number) {
    this.numResults = numResults;
    this.determineTotalPages();

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.processCurrentSet();
  }

  sortByBriefTitle() {
    this.lillyCoiData.sort((trialA: Trial, trialB: Trial) => {
      let a = trialA.brief_title.toUpperCase();
      let b = trialB.brief_title.toUpperCase();

      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    this.processCurrentSet();
  }

  sortByLeadSponsor() {
    this.lillyCoiData.sort((trialA: Trial, trialB: Trial) => {
      let a = trialA.lead_sponsor.toUpperCase();
      let b = trialB.lead_sponsor.toUpperCase();

      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    this.processCurrentSet();
  }

  sortByCompletionDate() {
    this.lillyCoiData.sort((trialA: Trial, trialB: Trial) => trialA.completion_date.date - trialB.completion_date.date);
    this.processCurrentSet();
  }

  processCurrentSet() {
    let sliceStart = this.numResults * (this.currentPage - 1);
    this.currentSet = this.lillyCoiData.slice(Number(sliceStart), Number(sliceStart) + Number(this.numResults));
  }

  determineTotalPages() {
    this.totalPages = Math.ceil(this.lillyCoiData.length / this.numResults);
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
    this.processCurrentSet();
  }

  ngOnInit(): void {
    this.lillyCoiService.getData()
      .subscribe((response: Response) => {
        this.lillyCoiData = JSON.parse(response.text()).results.map(trial => {
          let t = new Trial();

          if (trial.brief_title) {
            t.brief_title = trial.brief_title;
          } else {
            t.brief_title = '(no title)';
          }

          if (trial.sponsors && trial.sponsors.lead_sponsor && trial.sponsors.lead_sponsor.agency) {
            t.lead_sponsor = trial.sponsors.lead_sponsor.agency;
          } else {
            t.lead_sponsor = '(no lead sponsor)';
          }

          if (trial.completion_date && trial.completion_date.value) {
            t.completion_date = new TrialDate(trial.completion_date.value, new Date(trial.completion_date.value).getTime());
          } else {
            t.completion_date = new TrialDate('', new Date('January 1700').getTime());
          }
          return t;
        });

        this.determineTotalPages();
        this.processCurrentSet();
      });
  }
}
