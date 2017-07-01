import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { TestBed, async } from '@angular/core/testing';
import { LillyCoiService } from './lilly-coi.service';
import { AppComponent } from './app.component';

const response = {
  "results": [{ "brief_title": "My brief title", "sponsors": { "lead_sponsor": { "agency": "Patrick Ortiz" } }, "completion_date": { "attributes": { "type": "Actual" }, "value": "June 1987" }}],
  "resultCount": 1,
  "totalCount": 1,
  "nextPageUri": `http://example.com?limit=100&offset=100`,
  "previousPageUri": null
};

class ServiceStub extends LillyCoiService {
  constructor() {
    super(null, null);
  }

  getData(): Observable<object> {
    return new Observable(observer => {
      observer.next({ text: () => JSON.stringify(response) });
      observer.complete();
    });
  }
}

describe('AppComponent', () => {
  let service: ServiceStub;

  beforeEach(async(() => {
    service = new ServiceStub();

    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ AppComponent ],
      providers: [{ provide: LillyCoiService, useValue: service }]
    }).compileComponents();
  }));

  it('should use the LillyCoiService to get the data from the api', () => {
    spyOn(service, 'getData').and.returnValue({subscribe: () => {}});

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;

    expect(service.getData).toHaveBeenCalled();
  });

  it('should generate a table with class "data-table"', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('table.data-table')).not.toBeNull();
  }));

  it('should generate a table with three column headers', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const headings = compiled.getElementsByTagName('th');

    expect(headings).not.toBeNull();
    expect(headings.length).toBe(3);
    expect(headings[0].textContent).toBe('Brief Title');
    expect(headings[1].textContent).toBe('Lead Sponsor');
    expect(headings[2].textContent).toBe('Completion Date');
  }));

  it('should generate buttons for the column headers for sorting', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const buttons = compiled.querySelectorAll('th > button');

    expect(buttons).not.toBeNull();
    expect(buttons.length).toBe(3);
  });

  it('should generate a row for each trial in the result set', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const rows = compiled.querySelectorAll('tbody > tr');

    expect(rows).not.toBeNull();
    expect(rows.length).toBe(1);
  });

  it('should generate three cells for each trial row', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const cols = compiled.querySelectorAll('table tr:first-child td');

    expect(cols).not.toBeNull();
    expect(cols.length).toBe(3);
  });
});
