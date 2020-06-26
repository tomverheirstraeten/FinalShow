import {
  Component,
  OnInit,
  HostListener,
  Input,
  OnDestroy
} from '@angular/core';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  ChatService
} from 'src/app/services/chat.service';
import {
  UsersService
} from 'src/app/services/users.service';
import {
  first
} from 'rxjs/operators';
import * as _ from 'lodash';
import {
  Router
} from '@angular/router'
import {
  LoginComponent
} from '../login/login.component';
import {
  Subscription
} from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnDestroy {

  // @Input() closer: boolean;
  closer: boolean = true;
  displayNameOtherUser;
  functionOtherUser;
  myChats = [];
  filteredUsers = [];
  filteredChats = [];
  seen;
  searchInput: string;
  allUsers: unknown[];
  status: any[] = [];
  statusSub: Subscription;
  allChatSub: Subscription;

  getOtherUserNameSub: Subscription;
  getUserSub: Subscription;

  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService, public router: Router, public as: AdminService) {

  }
  ngOnDestroy() {
    if (this.allChatSub !== undefined) {
      this.allChatSub.unsubscribe();
    }
    if (this.statusSub !== undefined) {
      this.statusSub.unsubscribe();
    }
    if (this.getOtherUserNameSub !== undefined) {
      this.getOtherUserNameSub.unsubscribe();
    }
    if (this.getUserSub !== undefined) {
      this.getUserSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.getmyChats();
    this.getUsers();
  }
  updateMessageSeen(chatid) {
    this.cs.updateMessageSeenConversation(chatid);
  }

  async getmyChats() {
    const user = await this.auth.getUser();
    if (user) {
      const chats = [];
      this.myChats = [];
      const userId = user.uid;
      this.cs.getChatsForUser(userId).subscribe((res) => {
        for (const chat of res) {
          chats.push(chat);
          this.getOtherUserName(chat, chats, userId);
        }
      });
      this.cs.getChatsForUser2(userId).subscribe((res) => {
        for (const chat of res) {
          chats.push(chat);
          this.getOtherUserName(chat, chats, userId);
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
    // return false;
  }


  async getOtherUserName(chat, chats, userId) {
    if(chat.data.uid === userId){
      this.as.getUserByID(chat.data.uid2).subscribe(user => {
        console.log(user);
        chat.character = user['character'];
        chat.displayName = user['displayName'];
      })
    } else{
      this.as.getUserByID(chat.data.uid).subscribe(user => {
        chat.character = user['character'];
        chat.displayName = user['displayName'];
        console.log(user);
      });
    }
    this.myChats = chats;
  }


  search(event: any) {
    let value = event.target.value;
    let newArrayUsers = [];
    let newArrayChats = [];

    this.allUsers.forEach(user => {
      let displayName = user['displayName'].toLowerCase();
      if (displayName.includes(value.toLowerCase())) {
        newArrayUsers.push(user);
      }
    });
    this.myChats.forEach(chat => {
      let displayName = chat['displayName'].toLowerCase();
      if (displayName.includes(value.toLowerCase())) {
        newArrayChats.push(chat);
      }
    });

    this.filteredChats = newArrayChats;
    this.filteredUsers = newArrayUsers;
    this.checkIfSeen(this.filteredChats);
  }



  getUsers() {
    this.getUserSub = this.userService.getUsers().subscribe(res => {
      this.allUsers = res;
      this.filteredUsers = res;
      this.checkStatus();
    });
  }

  toggleConversation() {

    this.closer = !this.closer;
  }
  closeConversation() {
    this.closer = true;
  }

  checkStatus() {
    this.statusSub = this.userService.getUsersStatus().subscribe(res => {
      this.status = res;
      const users = [];
      for (const user of this.allUsers) {


        for (const status of this.status) {
          if (status.uid === user['uid']) {
            user['status'] = status.status;
          }
        }
        users.push(user);
      }

      this.filteredUsers = _.orderBy(users, ['status'], ['desc']);
    })
  }

  goToChat(chatId) {
    this.updateMessageSeen(chatId);
    return this.router.navigate([`chats/${chatId}`]);
  }
}
