import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {
  displayNameOtherUser;
  myChats;
  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService) {

   }

  ngOnInit() {
  this.getmyChats();
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
}
