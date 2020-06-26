import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
// import { ChatService } from 'src/app/services/chat.service';
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


  status: any[] = [];
  constructor(public auth: AuthService, public userService: UsersService, public router: Router) {

  }

  ngOnInit() {
    // this.getmyChats();
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
  //   const user = await this.auth.getUser();
  //   if (user) {
  //     const userId = user.uid;
  //     this.allChatSub = await this.cs.getAllChats().subscribe((res) => {
  //       const chats = [];
  //       for (const chat of res) {
  //         if (chat['uid'] === userId || chat['uid2'] === userId) {
  //           chats.push(chat);
  //           this.getOtherUserName(chat, chats, userId);
  //         }
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
