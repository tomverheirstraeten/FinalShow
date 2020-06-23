import { Component, OnInit, OnChanges, AfterViewInit, AfterViewChecked } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-livechat',
  templateUrl: './livechat.component.html',
  styleUrls: ['./livechat.component.scss']
})
export class LivechatComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  chat$: Observable<any>;
  newMsg: any;
  myScrollContainer: any;
  disableScrollDown: boolean;

  constructor(private route: ActivatedRoute,
              public auth: AuthService,
              public userService: UsersService,
              public roomService: RoomsService) { }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    this.scrollBottom();
  }
  ngAfterViewInit() {
    this.scrollBottom();
  }
  ngAfterViewChecked() {
    this.scrollBottom();
  }
  ngOnInit() {
    this.getAllChats();
    const source = this.roomService.get('xWsddAUZ7AFFUOVJ9Muv');
    this.chat$ = this.roomService.joinUsers(source);
    console.log(this.chat$);

    this.scrollBottom();
  }

  getAllChats(){
    this.roomService.get('xWsddAUZ7AFFUOVJ9Muv').subscribe(res => {
      console.log(res['messages']);
      this.scrollBottom();
    });

  }

  submitHand(chat) {
    this.roomService.sendMessageHand('xWsddAUZ7AFFUOVJ9Muv');
    // this.updateMessageSeen(chat);
    this.newMsg = '';
    this.scrollBottom();
  }




  submit(chatId) {
    if (!this.newMsg) {
      return alert('you need to enter something');
    }
    this.roomService.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
    this.scrollBottom();
  }

  trackByCreated(i, msg) {
    // this.scrollBottom();
    return msg.createdAt;
  }


  public onScroll() {
    const element = this.myScrollContainer.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (this.disableScrollDown && atBottom) {
      this.disableScrollDown = false;
    } else {
      this.disableScrollDown = true;
    }
  }




  private scrollBottom() {

    const chatElem = document.getElementById("livechat-container");

    if (chatElem) {
      setTimeout(() => chatElem.scrollTop = chatElem.scrollHeight, 500);
    }
  }
}
