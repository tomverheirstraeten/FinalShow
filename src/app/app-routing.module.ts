import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

import { HomeComponent } from './components/home/home.component';
import { RoomnavComponent } from './components/roomnav/roomnav.component';
import { LivestreamComponent } from './components/livestream/livestream/livestream.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { LoginComponent } from './components/network/login/login.component';
import { RegisterComponent } from './components/network/register/register.component';
import { NetworkComponent } from './components/network/network/network.component';
import { FaqComponent } from './components/faq/faq.component';
import { EventComponent } from './components/event/event.component';
import { ChatComponent } from './components/network/chat/chat.component';
import { RoomComponent } from './components/network/room/room.component';
import { DesktopLandingComponent } from './components/desktoplanding/desktoplanding.component';
import { AdminhomeComponent } from './components/admin/adminhome/adminhome.component';
import { AdmintimetableComponent } from './components/admin/admintimetable/admintimetable.component';
import { AdminroomsComponent } from './components/admin/adminrooms/adminrooms.component';
import { AdminusersComponent } from './components/admin/adminusers/adminusers.component';
import { AdminroomComponent } from './components/admin/adminroom/adminroom.component';
import { AdminnotificationsComponent } from './components/admin/adminnotifications/adminnotifications.component';
import { AdminlivestreamComponent } from './components/admin/adminlivestream/adminlivestream.component';
<<<<<<< HEAD
import { ProfileComponent } from './components/profile/profile.component';
=======
import { RedirectComponent } from './components/redirect/redirect.component';
import { FourOfourComponent } from './components/four-ofour/four-ofour.component';
>>>>>>> master


const routes: Routes = [
  { path: '', component: RedirectComponent },
  { path: 'mobileLanding', component: HomeComponent },
  { path: 'desktopLanding', component: DesktopLandingComponent },
  { path: 'room/:id', component: RoomComponent },
  { path: 'rooms', component: RoomnavComponent },
  { path: 'livestream', component: LivestreamComponent },
  { path: 'timetable', component: TimetableComponent },
  { path: 'login/:id', component: LoginComponent },
  { path: 'register/:id', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'network', component: NetworkComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'timetable/:event', component: EventComponent },
  { path: 'chats/:id', component: ChatComponent, canActivate: [AuthGuard] },
<<<<<<< HEAD
  { path: 'profile', component: ProfileComponent},
  { path: 'admin', component: AdminhomeComponent},
  { path: 'admin/timetable', component: AdmintimetableComponent},
  { path: 'admin/chat', component: AdminroomsComponent},
  { path: 'admin/chat/:id', component: AdminroomComponent},
  { path: 'admin/users', component: AdminusersComponent},
  { path: 'admin/notifications', component: AdminnotificationsComponent},
  { path: 'admin/livestream', component: AdminlivestreamComponent}
=======
  { path: 'admin', component: AdminhomeComponent },
  { path: 'admin/timetable', component: AdmintimetableComponent },
  { path: 'admin/chat', component: AdminroomsComponent },
  { path: 'admin/chat/:id', component: AdminroomComponent },
  { path: 'admin/users', component: AdminusersComponent },
  { path: 'admin/notifications', component: AdminnotificationsComponent },
  { path: 'admin/livestream', component: AdminlivestreamComponent },
  { path: '404', component: FourOfourComponent }
>>>>>>> master
  // { path: 'room/:id', component: RoomComponent, canActivate: [AuthGuard] },
  // { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
