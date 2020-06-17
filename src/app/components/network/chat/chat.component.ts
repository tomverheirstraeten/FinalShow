import { Component, OnInit, AfterViewInit, AfterContentInit, HostListener } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],

})
export class ChatComponent implements OnInit, AfterViewInit {
  chat$: Observable<any>;
  newMsg: string;
  allChats: any[] = [];
  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService,
    public userService: UsersService,
    private router: Router
  ) { }
  ngAfterViewInit() {
    this.scrollBottom();
  }
  ngOnInit() {
    this.getAllChats();
    const chatId = this.route.snapshot.paramMap.get('id');
    const source = this.cs.get(chatId);
    this.chat$ = this.cs.joinUsers(source); // .pipe(tap(v => this.scrollBottom(v)));
  }

  @HostListener('load', ['$event']) onPageLoad(event: Event) {
    this.scrollBottom();
  }







  getAllChats() {
    this.cs.getAllChats().subscribe((chats) => {
      this.allChats = chats;
    });
  }
  submit(chatId) {
    if (!this.newMsg) {
      return alert('you need to enter something');
    }
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
    this.scrollBottom();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  private scrollBottom() {

    const chatElem = document.getElementById("chat");

    if (chatElem) {
      setTimeout(() => chatElem.scrollTop = chatElem.scrollHeight, 500);
    }

    // setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }
}
