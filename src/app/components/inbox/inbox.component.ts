import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {

  closer = true;
  displayNameOtherUser;
  myChats = [];
  allChatSub;
  otherUsernameSub;
  seen;
  user;

  status: any[] = [];
  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService, public router: Router,public as: AdminService) {

  }

  ngOnInit() {
    this.checkIfUser();

  }
  async checkIfUser() {
    this.user = await this.auth.getUser();
    if (this.user) {
      //this.getmyChats();
    }
  }
  ngOnDestroy() {
    if(this.allChatSub !== undefined){
      this.allChatSub.unsubscribe();
    }
    if(this.otherUsernameSub !== undefined){
    this.otherUsernameSub.unsubscribe();
    }
  }

  // async getmyChats() {
  //   if (this.user) {
  //     const chats = [];
  //     this.myChats = [];
  //     const userId = this.user.uid;
  //     this.cs.getChatsForUser(userId).subscribe((res) => {
  //       for (const chat of res) {
  //         chats.push(chat);
  //         this.getOtherUserName(chat, chats, userId);
  //       }
  //     });
  //     this.cs.getChatsForUser2(userId).subscribe((res) => {

  //       for (const chat of res) {
  //         chats.push(chat);
  //         this.getOtherUserName(chat, chats, userId);

  //       }
  //     });
  //   }
  // }





  // async checkIfSeen(chat) {
  //   let checkIfSeen;

  //   for (const message of chat['messages']) {
  //     if (message.uid !== this.auth.userId && !message.seen) {

  //       checkIfSeen = true;
  //     }
  //   }
  //   return checkIfSeen;
  // }


  // async getOtherUserName(chat, chats, userId) {
  //  this.otherUsernameSub =  this.userService.getUsers().pipe(first()).subscribe(async res => {
  //     for (const user of res) {
  //       if (userId === chat.uid2) {
  //         if (user['uid'] === chat.uid) {
  //           this.displayNameOtherUser = user['displayName'];

  //           chat.displayName = this.displayNameOtherUser;
  //         }
  //       } else {
  //         if (user['uid'] === chat.uid2) {
  //           this.displayNameOtherUser = user['displayName'];
  //           chat.displayName = this.displayNameOtherUser;
  //         }
  //       }
  //       this.myChats = chats;
  //     }
  //   });
  // }





  toggleConversation() {

    this.closer = !this.closer;
  }

  goToChat(chat) {
    // return this.router.navigate([`chats/${chat.id}`]);
  }


}
