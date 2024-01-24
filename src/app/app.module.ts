import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderConfig, NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig =
{
  "bgsColor": "#162f65",
  "bgsOpacity": 1,
  "bgsPosition": "center-center",
  "bgsSize": 60,
  "bgsType": "fading-circle",
  "blur": 15,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#162f65",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "fading-circle",
  "gap": 10,
  "logoPosition": "center-center",
  "logoSize": 200,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgb(255,255,255)",
  "pbColor": "red",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": false,
  "text": "Loading...",
  "textColor": "#000000",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 300
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule
  ],
  providers: [Title, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
