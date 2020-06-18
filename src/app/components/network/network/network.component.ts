import { Component, OnInit, OnChanges } from '@angular/core';

import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit, OnChanges {
user;
  userChats$;
  myChats: any = [];
  allRooms: any = [];
  displayNameOtherUser: String = '';
  closer: boolean = true;
  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService, public route: Router) {

  }
  ngOnInit() {
    console.log(this.auth.userId);

   this.checkIfUser();
  }
async checkIfUser(){
  if (this.auth.userId) {
    this.user = await this.auth.user$;
  } else {
    this.goToLogin();

  }
}





  ngOnChanges() {
    // if (!this.auth.user$) {
    //   // this.goToLogin();
    // } else {
    //   this.user = this.auth.user$;
    // }
  }




  goToLogin() {
    this.route.navigate(['/login']);
  }
  closeSearch(){
    this.closer = false;
    console.log('close');
  }
}
