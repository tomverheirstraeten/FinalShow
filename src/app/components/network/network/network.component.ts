import { Component, OnInit, OnChanges } from '@angular/core';

import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';

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
  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService, public route: Router) {

  }
  ngOnInit() {
    console.log(this.auth.userId);
    this.getmyChats();
   this.checkIfUser();
  }
async checkIfUser(){
  if (this.auth.userId) {
    this.user = await this.auth.user$;
  } else {
    this.goToLogin();

  }
}


  async getmyChats() {

    const user = await this.auth.getUser();
    if (user) {
      const userId = user.uid;
      await this.cs.getAllChats().subscribe((res) => {
        const chats = [];
        for (const chat of res) {
          if (chat['uid'] === userId || chat['uid2'] === userId) {
            // chats.push(chat);
            this.getOtherUserName(chat, chats, userId);
          }
        }

      });
    }

  }

  async getOtherUserName(chat, chats, userId) {
    this.userService.getUsers().pipe(first()).subscribe(res => {
      for (const user of res) {
        if (userId === chat.uid2) {
          if (user['uid'] === chat.uid) {
            this.displayNameOtherUser = user['displayName'];
            chat.displayName = this.displayNameOtherUser;
            chats.push(chat);
          }
        } else {
          if (user['uid'] === chat.uid2) {
            this.displayNameOtherUser = user['displayName'];
            chat.displayName = this.displayNameOtherUser;
            chats.push(chat);
          }
        }
        this.myChats = chats;
      }
    });
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
}
