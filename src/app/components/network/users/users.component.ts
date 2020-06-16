import { Component, OnInit, OnChanges } from '@angular/core';

import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'
import { first, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnChanges {
  allRooms;
  status: any = [];

  public allUsers: any = [];
  public allUserData: any = [];

  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService, private router: Router) {
    this.getUsers();
  }
  ngOnInit() {
    this.getUsers();
  }
  ngOnChanges() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.allUsers = res;
      this.checkStatus();
    });
  }
  checkStatus() {
    this.userService.getUsersStatus().subscribe(res => {
      this.status = res;
      const users = [];
      for (const user of this.allUsers) {

        // console.log(user['uid']);
        for (const status of this.status) {
          if (status.uid === user['uid']) {
            user.status = status.status;
          }
        }
        users.push(user);
      }

      this.allUserData = _.orderBy(users, ['status'], ['desc']);
    });
  }



  async checkIfConversation(uid2) {
    console.log('clicked');
    const user = await this.auth.getUser();
    const userId = user.uid;

    let chatId;
    // tslint:disable-next-line: no-unused-expression
    this.cs.getAllChats().pipe(take(1)).subscribe(async (chats) => {
      // console.log('chats', chats);
      if (!chats.length) {
        // console.log('No rooms');
        this.cs.create(uid2);
      } else {
        let exist = '';
        for (const chat of chats) {
          if (chat['uid'] === userId && chat['uid2'] === uid2 || chat['uid'] === uid2 && chat['uid2'] === userId) {
            exist = 'true';
            chatId = chat.id;
          }
        }
        await this.checkIfExist(exist, chatId, uid2);
      }
    });

  }

  async checkIfExist(exist, chatId, uid2) {
    console.log(exist)
    if (exist === 'true') {
      // console.log('Redirect to room');
      this.router.navigate(['chats', chatId]);
    } else {
      this.cs.create(uid2);
      // console.log('create new !!!');
    }
  }
}
