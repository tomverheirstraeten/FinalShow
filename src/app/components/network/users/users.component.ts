import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';

import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs'
import { first, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
// import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { ChatService } from 'src/app/services/chat.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data;
  allRooms;
  status: any = [];
  userSub: Subscription;
  userStatusSub: Subscription;
  public allUsers: any = [];
  public allUserData: any = [];

  constructor(public auth: AuthService, public userService: UsersService, private router: Router,public cs: ChatService, private as: AdminService) {
    this.getUsers();
  }
  ngOnInit() {
    this.getUsers();
  }
  ngOnChanges() {
    this.getUsers();
  }
  ngOnDestroy() {
    if (this.userSub !== undefined) {
      this.userSub.unsubscribe();
    }
    if (this.userStatusSub !== undefined) {
      this.userStatusSub.unsubscribe();
    }


  }

  getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.allUsers = res;
      this.checkStatus();
    });
  }
  checkStatus() {
   this.userStatusSub =  this.userService.getUsersStatus().subscribe(res => {
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
    const user = await this.auth.getUser();
    if (user) {
      this.as.getUserByID(uid2).subscribe(val => {
        console.log(val);
        if(val['messages']){
          for(const index of val['messages']){
            if(user.messages){
              if(user.messages.includes(index)){
                this.router.navigate(['chats', index]);
              } else{
                this.cs.create(uid2);
              }
            }
          }
        } else{
          this.cs.create(uid2);
        }
      });
    }
  }

//         for(const index of val){
// for(const messageId of index['messages']){
//   onsle.log()
// }
          // if(chatid == user.uid){

          // } else{
          //   this.cs.create(uid2)
          // }
      //   })
      // })
      // const userId = user.uid;
      // this.cs.getChatsForUser(userId).subscribe((res) => {
      //   console.log(res);
      //   // if(!res.length || res === undefined || res === null ){
      //   //   this.cs.create(uid2);
      //   // }else{

      //   //   this.router.navigate(['chats', res['id']]);
      //   // }
      // });
      // this.cs.getChatsForUser2(userId).subscribe((res) => {
      //   console.log(res);
      //   // for (const chat of res) {

      //   // }
      // });
  //   }
  // }

  // async checkIfConversation(uid2) {
  //   console.log('clicked');
  //   const user = await this.auth.getUser();
  //   const userId = user.uid;

  //   let chatId;
  //   // tslint:disable-next-line: no-unused-expression
  //   this.userSub = this.cs.getAllChats().pipe(take(1)).subscribe(async (chats) => {
  //     // console.log('chats', chats);
  //     if (!chats.length) {
  //       // console.log('No rooms');
  //       this.cs.create(uid2);
  //     } else {
  //       let exist = '';
  //       for (const chat of chats) {
  //         if (chat['uid'] === userId && chat['uid2'] === uid2 || chat['uid'] === uid2 && chat['uid2'] === userId) {
  //           exist = 'true';
  //           chatId = chat.id;
  //         }
  //       }
  //       await this.checkIfExist(exist, chatId, uid2);
  //     }
  //   });

  // }

  async checkIfExist(exist, chatId, uid2) {
    console.log(exist)
    if (exist === 'true') {
      // console.log('Redirect to room');
      this.router.navigate(['chats', chatId]);
    } else {
      // this.cs.create(uid2);
      // console.log('create new !!!');
    }
  }
}
