import { Component, OnInit, AfterViewInit, AfterContentInit, HostListener, Inject, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { DOCUMENT } from '@angular/common';
import { AdminService } from 'src/app/services/admin.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export class ChatComponent implements OnInit, AfterViewInit {
  chat$: Observable<any>;
  newMsg: string;
  allChats: any[] = [];
  source: Observable<any>;
  chatId;

  deleteWindow = false;

  user1: string;
  user2: string;

  mobile = false;

  currentChat;
  currentMsg;
  currentI;

  showMobileDeleteWindow = false;

  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService,
    public userService: UsersService,
    private router: Router,
    private as: AdminService
  ) {
    this.route.paramMap.subscribe(params => {
      this.ngOnInit();
    });
    if(screen.width < 768){
      this.mobile = true;
    }
   }

  ngAfterViewInit() {
    this.scrollBottom();
  }

  ngOnInit() {
    this.getAllChats();
    this.chatId = this.route.snapshot.paramMap.get('id');
    const source = this.cs.get(this.chatId);
    this.chat$ = this.cs.joinUsers(source);
     // .pipe(tap(v => this.scrollBottom(v)));
    this.getUsername(this.chatId);
  }

  @HostListener('load', ['$event']) onPageLoad(event: Event) {
    this.scrollBottom();
  }

  holdHandler(e, chat, msg, i){
    if(e == 500){
      console.log('longpressed');
      this.currentChat = chat;
      this.currentMsg = msg;
      this.currentI = i;

      this.showMobileDeleteWindow = true;
    }
  }

  cancelDelete(){
    this.showMobileDeleteWindow = false;
  }

  deleteMessage(){
    this.cs.updateMessage(this.currentChat, this.currentMsg, this.currentI);
  }

  updateMessageSeen(chat){
    this.cs.updateMessageSeen(chat);
  }

  toggleDeleteWindow(messages, msg){
    messages.forEach(element => {
      if(element == msg){
        msg.deleteWindow = !msg.deleteWindow;
      } else{
        element.deleteWindow = false;
      }
    });
  }

  clickedDelete(chat, msg, i){
    this.deleteWindow = false;
    this.cs.updateMessage(chat, msg, i);
  }

  getAllChats() {
    this.cs.getAllChats().subscribe((chats) => {
      this.allChats = chats;
      this.scrollBottom();
      setTimeout(this.showLastSeen, 500);
    });
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getUsername(chatId){
    this.as.getChat(chatId).subscribe(val => {
      this.as.getUserByID(val['uid']).subscribe(user1 => {
        this.user1 = user1['displayName'] + ' (' + this.capitalize(user1['function']) + ')';
      });
      this.as.getUserByID(val['uid2']).subscribe(user2 => {
        this.user2 = user2['displayName'] + ' (' + this.capitalize(user2['function']) + ')';
      })
    })
  }

  showLastSeen(){
    const list = document.getElementsByClassName('seen');
    for(let i = 0; i < list.length - 1; i++){
      list[i].classList.remove('seen-show');
    }
    const item = list.item(list.length - 1);
    item.classList.add('seen-show');
  }

  submit(chatId) {
    if (!this.newMsg) {
      return alert('you need to enter something');
    }
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
    this.scrollBottom();
  }

  submitHand(chat) {
    this.cs.sendMessageHand(chat.id);
    // this.updateMessageSeen(chat);
    this.newMsg = '';
    this.scrollBottom();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  private scrollBottom() {

    // const chatElem = document.getElementById("chat");

    // if (chatElem) {
    //   setTimeout(() => chatElem.scrollTop = chatElem.scrollHeight, 500);
    // }

    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 200);
  }

  returnDate(timestamp) {
    let date = new Date(timestamp);
    let string = date.getHours() + ":" + date.getMinutes();
    return string;
  }
}
