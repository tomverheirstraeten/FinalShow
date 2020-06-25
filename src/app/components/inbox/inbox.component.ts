import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';

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
  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService, public router: Router) {

  }

  ngOnInit() {
    this.checkIfUser();

  }
  async checkIfUser() {
    this.user = await this.auth.getUser();
    if (this.user) {
      this.getmyChats();
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

  async getmyChats() {

    if (this.user) {
      const userId = this.user.uid;
      this.allChatSub = await this.cs.getAllChats().subscribe((res) => {
        const chats = [];
        for (const chat of res) {
          if (chat['uid'] === userId || chat['uid2'] === userId) {
            chats.push(chat);
            this.getOtherUserName(chat);
          }
        }
      });
    }
  }


  async checkIfSeen(chat) {
    let checkIfSeen;

    for (const message of chat['messages']) {
      if (message.uid !== this.auth.userId && !message.seen) {

        checkIfSeen = true;
      }
    }
    return checkIfSeen;
  }

  async getOtherUserName(chat) {
    console.log(this.user.uid);
    console.log(chat.uid);

    if (this.user.uid === chat.uid) {
      this.userService.getUser(chat.uid2).subscribe(otherUser => {
        chat.displayName = otherUser['displayName'];
        chat.character = otherUser['character'];
        chat.function = otherUser['function']
      });
    } else {
      this.userService.getUser(chat.uid).subscribe(otherUser => {
        chat.displayName = otherUser['displayName'];
         chat.character = otherUser['character'];
         chat.function = otherUser["function"];
      });
    }
    this.myChats.push(chat);


  }



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
    return this.router.navigate([`chats/${chat.id}`]);
  }


}
