'use strict';

import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { LillyCoiService } from "./lilly-coi.service";
import { Trial, TrialDate } from './trial.type';

export enum SortOrder {
  ASCENDING,
  DESCENDING
}

export enum SortBy {
  BRIEF_TITLE,
  LEAD_SPONSOR,
  COMPLETION_DATE
}

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
  private sortOrder: SortOrder = SortOrder.ASCENDING;
  private sortBy: SortBy.BRIEF_TITLE;

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

  isSortingAscending() { return this.sortOrder as SortOrder === SortOrder.ASCENDING; }
  isSortingDescending() { return this.sortOrder as SortOrder === SortOrder.DESCENDING; }

  isSortingByBriefTitle() { return this.sortBy as SortBy === SortBy.BRIEF_TITLE; }
  isSortingByLeadSponsor() { return this.sortBy as SortBy === SortBy.LEAD_SPONSOR; }
  isSortingByCompletionDate() { return this.sortBy as SortBy === SortBy.COMPLETION_DATE; }

  determineSortSettings(requestedSortBy) {
    if (this.sortBy !== requestedSortBy) {
      this.sortBy = requestedSortBy;
      this.sortOrder = SortOrder.ASCENDING;
    } else {
      if (this.sortOrder === SortOrder.ASCENDING) this.sortOrder = SortOrder.DESCENDING;
      else this.sortOrder = SortOrder.ASCENDING;
    }
  }

  compareValues(a: any, b: any): number {
    if (a < b) return this.sortOrder === SortOrder.ASCENDING ? -1 : 1;
    if (a > b) return this.sortOrder === SortOrder.ASCENDING ? 1 : -1;
    return 0;
  }

  sortByAlphabet(field: string, trialA: Trial, trialB: Trial) {
    let a = trialA[field].toUpperCase();
    let b = trialB[field].toUpperCase();

    return this.compareValues(a, b);
  }

  sortByBriefTitle() {
    this.determineSortSettings(SortBy.BRIEF_TITLE);

    this.lillyCoiData.sort(this.sortByAlphabet.bind(this, 'brief_title'));
    this.processCurrentSet();
  }

  sortByLeadSponsor() {
    this.determineSortSettings(SortBy.LEAD_SPONSOR);
    console.log(this.sortBy, this.sortOrder);

    this.lillyCoiData.sort((trialA: Trial, trialB: Trial) => {
      let result = this.sortByAlphabet('lead_sponsor', trialA, trialB);

      if (result === 0) {
        return this.sortByAlphabet('brief_title', trialA, trialB);
      }

      return result;
    });
    this.processCurrentSet();
  }

  sortByCompletionDate() {
    this.determineSortSettings(SortBy.COMPLETION_DATE);

    this.lillyCoiData.sort((trialA: Trial, trialB: Trial) => {
      let a = trialA.completion_date.date;
      let b = trialB.completion_date.date;

      let result = this.compareValues(a, b);

      if (result === 0) {
        return this.sortByAlphabet('brief_title', trialA, trialB);
      }

      return result;
    });
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
