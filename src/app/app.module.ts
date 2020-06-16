import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AngularFireModule } from '@angular/fire';
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
import { LivechatComponent } from './livechat/livechat.component';
import { environment } from 'src/environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';

import { ChatComponent } from './chat/chat.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './room/room.component';
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
      RoomnavComponent,
      LivechatComponent,
      RegisterComponent,
      UsersComponent,
      ChatComponent,
      RoomsComponent,
      RoomComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      FormsModule,
      ReactiveFormsModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
