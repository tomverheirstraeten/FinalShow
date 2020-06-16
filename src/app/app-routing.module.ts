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


const routes: Routes = [
  {path: '', component: HomeComponent},
  { path: 'room/:id', component: RoomComponent },
  {path: 'rooms', component: RoomnavComponent},
  {path: 'livestream', component: LivestreamComponent},
  {path: 'timetable', component: TimetableComponent},
  {path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  {path: 'network', component: NetworkComponent},
  {path: 'faq', component: FaqComponent},
  {path: 'timetable/:event', component: EventComponent},
  { path: 'chats/:id', component: ChatComponent, canActivate: [AuthGuard] },
  // { path: 'room/:id', component: RoomComponent, canActivate: [AuthGuard] },
  // { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
