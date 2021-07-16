import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CheckoutPageComponent} from './pages/checkout-page/checkout-page.component';
import {WindowRef} from "./WindowRef";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TOAST_NOTIFICATIONS_CONFIG, ToastNotificationsModule} from "ngx-toast-notifications";
import {LoadingBarModule} from "@ngx-loading-bar/core";
import {LoadingBarHttpClientModule} from "@ngx-loading-bar/http-client";
import { HeaderComponent } from './pages/header/header.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckoutPageComponent,
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastNotificationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    LoadingBarModule
  ],
  providers: [
    {provide: TOAST_NOTIFICATIONS_CONFIG, useValue: {duration: 6000, type: 'dark', position: 'top-center'}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
