'use strict';

export class TrialDate {
  constructor(
    public value?: string,
    public date?: number
  ) {}
}

export class Trial {
  constructor(
    public brief_title?: string,
    public lead_sponsor?: string,
    public completion_date?: TrialDate
  ) {}
}
