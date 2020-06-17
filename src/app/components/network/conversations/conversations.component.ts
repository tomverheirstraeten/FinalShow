import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {
  displayNameOtherUser;
  functionOtherUser;
  myChats;
  filteredUsers = [];
  filteredChats = [];
  searchInput: string;
  allUsers: unknown[];
  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService) {

   }

  ngOnInit() {
  this.getmyChats();
  this.getUsers();
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
            this.functionOtherUser = user['function'];
            chat.displayName = this.displayNameOtherUser;
            chat.function = this.functionOtherUser;
            chats.push(chat);

          }
        } else {
          if (user['uid'] === chat.uid2) {
            this.displayNameOtherUser = user['displayName'];
            this.functionOtherUser = user['function'];
            chat.displayName = this.displayNameOtherUser;
            chat.function = this.functionOtherUser;
            chats.push(chat);
          }
        }
        this.myChats = chats;
        this.filteredChats = chats;
        // console.log(this.allData);
      }
    });
  }


  search(event:any){
    let value = event.target.value;
    let newArrayUsers = [];
    let newArrayChats = [];
    // let newArray = _.filter(this.allUsers, _.matches(value));
    // var test = _.filter(this.allUsers, function (item) {
    //   return _.some(item.displayName, function (tag) {
    //     return tag;
    //     return _.startsWith(tag, value);
    //   });
    // });
    this.allUsers.forEach(user => {
      let displayName = user['displayName'].toLowerCase();
      if(displayName.includes(value)){
        newArrayUsers.push(user);
      }
    });
    this.myChats.forEach(chat => {
      let displayName = chat['displayName'].toLowerCase();
      if (displayName.includes(value)) {
        newArrayChats.push(chat);
      }
    });
    // var test = this.allUsers.filter(function (item) {
    //   return item['displayName'].some(function (tag) {
    //     return 0 === tag.indexOf(value);
    //   });
    // });
    // console.log(newArrayUsers,newArrayChats);
    this.filteredChats = newArrayChats;
    this.filteredUsers = newArrayUsers;
    // let [...array] = _.uniq(this.allData);
    // console.log(array)
  }

  getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.allUsers = res;
      this.filteredUsers = res;
    });
  }

}
