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
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnDestroy{

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
  usersSub: Subscription;
  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService, public router: Router) {

  }
  ngOnDestroy(){
    this.allChatSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.usersSub.unsubscribe();
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
      const userId = user.uid;
      this.allChatSub = await this.cs.getAllChats().subscribe((res) => {
        const chats = [];
        for (const chat of res) {
          if (chat['uid'] === userId || chat['uid2'] === userId) {
            // chats.push(chat);
            this.getOtherUserName(chat, chats, userId);
          }
        }
      })
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
    this.userService.getUsers().pipe(first()).subscribe(async res => {
      for (const user of res) {
        if (userId === chat.uid2) {
          if (user['uid'] === chat.uid) {
            this.displayNameOtherUser = user['displayName'];
            this.functionOtherUser = user['function'];
            chat.displayName = this.displayNameOtherUser;
            chat.function = this.functionOtherUser;


            await this.checkIfSeen(chat).then(res => {

              if (res) {

              }
              chat.seen = res;
              chats.push(chat);
            });



          }
        } else {
          if (user['uid'] === chat.uid2) {
            this.displayNameOtherUser = user['displayName'];
            this.functionOtherUser = user['function'];
            chat.displayName = this.displayNameOtherUser;
            chat.function = this.functionOtherUser;

            await this.checkIfSeen(chat).then(res => {
              if (res) {

              }
              chat.seen = res;
              chats.push(chat);
            });

          }
        }
        this.myChats = chats;
        this.filteredChats = chats;


      }
    }).unsubscribe();
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
    this.userService.getUsers().subscribe(res => {
      this.allUsers = res;
      this.filteredUsers = res;
      this.checkStatus();
    }).unsubscribe();
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

  goToChat(chat) {
    this.updateMessageSeen(chat.id);
    return this.router.navigate([`chats/${chat.id}`]);
  }
}
