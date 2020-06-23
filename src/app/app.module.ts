import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AngularFireModule } from '@angular/fire';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from 'src/environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworkComponent } from './components/network/network/network.component';
import { HomeComponent } from './components/home/home.component';
import { LivestreamComponent } from './components/livestream/livestream/livestream.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { LoginComponent } from './components/network/login/login.component';
import { FaqComponent } from './components/faq/faq.component';
import { EventComponent } from './components/event/event.component';
import { HeaderComponent } from './components/header/header.component';
import { RoomnavComponent } from './components/roomnav/roomnav.component';
import { LivechatComponent } from './components/livestream/livechat/livechat.component';
import { RegisterComponent } from './components/network/register/register.component';
import { UsersComponent } from './components/network/users/users.component';
import { ChatComponent } from './components/network/chat/chat.component';
import { RoomsComponent } from './components/network/rooms/rooms.component';
import { RoomComponent } from './components/network/room/room.component';
import { ConversationsComponent } from './components/network/conversations/conversations.component';
import { DesktopLandingComponent } from './components/desktoplanding/desktoplanding.component';
import { NotificationComponent } from './components/notification/notification.component';
import { AdminhomeComponent } from './components/admin/adminhome/adminhome.component';
import { AdminheaderComponent } from './components/admin/adminheader/adminheader.component';
import { AdmintimetableComponent } from './components/admin/admintimetable/admintimetable.component';
import { AdminroomsComponent } from './components/admin/adminrooms/adminrooms.component';
import { AdminusersComponent } from './components/admin/adminusers/adminusers.component';
import { AdminroomComponent } from './components/admin/adminroom/adminroom.component';
import { AdminnotificationsComponent } from './components/admin/adminnotifications/adminnotifications.component';
import { AdminlivestreamComponent } from './components/admin/adminlivestream/adminlivestream.component';
import { DesktopeventComponent } from './components/desktopevent/desktopevent.component';
import { RedirectComponent } from './components/redirect/redirect.component';

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
      RoomComponent,
      ConversationsComponent,
      DesktopLandingComponent,
      NotificationComponent,
      AdminhomeComponent,
      AdminheaderComponent,
      AdmintimetableComponent,
      AdminroomsComponent,
      AdminusersComponent,
      AdminroomComponent,
      AdminnotificationsComponent,
      AdminlivestreamComponent,
      DesktopeventComponent,
      RedirectComponent
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
