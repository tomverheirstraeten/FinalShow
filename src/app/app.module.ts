import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LivestreamComponent } from './livestream/livestream.component';
import { TimetableComponent } from './timetable/timetable.component';
import { LoginComponent } from './login/login.component';
import { NetworkComponent } from './network/network.component';
import { FaqComponent } from './faq/faq.component';
import { EventComponent } from './event/event.component';
import { HeaderComponent } from './header/header.component';
import { RoomnavComponent } from './roomnav/roomnav.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LivestreamComponent,
    TimetableComponent,
    LoginComponent,
    NetworkComponent,
    FaqComponent,
    EventComponent,
    HeaderComponent,
    RoomnavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
