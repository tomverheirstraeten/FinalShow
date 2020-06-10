import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LivestreamComponent } from './livestream/livestream.component';
import { TimetableComponent } from './timetable/timetable.component';
import { LoginComponent } from './login/login.component';
import { FaqComponent } from './faq/faq.component';
import { NetworkComponent } from './network/network.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'livestream', component: LivestreamComponent},
  {path: 'timetable', component: TimetableComponent},
  {path: 'login', component: LoginComponent},
  {path: 'network', component: NetworkComponent},
  {path: 'faq', component: FaqComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
