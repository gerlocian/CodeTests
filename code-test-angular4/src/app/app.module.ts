import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LillyCoiService } from './lilly-coi.service';
import { ServiceApiOptions } from './service-api-options.type';

export function serviceApiFactory () {
  return new ServiceApiOptions('http://api.lillycoi.com', 'v1/trials');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    LillyCoiService,
    { provide: ServiceApiOptions, useFactory: serviceApiFactory, deps: []}
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
