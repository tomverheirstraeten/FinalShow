import { Component, OnInit, AfterViewInit, OnChanges, AfterViewChecked, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnChanges, OnDestroy {

  chat$: Observable<any>;
  newMsg: string;

  mobile = false;

  currentGroup;
  currentMsg;
  currentI;

  showMobileDeleteWindow = false;


  @ViewChild('chatBox') private myScrollContainer: ElementRef;
  disableScrollDown = false;

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    public userService: UsersService,
    public roomService: RoomsService,
  ) {
    if(screen.width < 768){
      this.mobile = true;
    }
  }
  @HostListener('window:load', ['$event']) onPageLoad(event: Event) {
    // this.scrollBottom();

    setTimeout(() => {
      console.log('loaded');
      this.scrollBottom();
    }, 500);

  }
  ngOnDestroy(){

  }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    this.scrollBottom();
  }

  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id');
    const source = this.roomService.get(chatId);
    this.chat$ = this.roomService.joinUsers(source); // .pipe(tap(v => this.scrollBottom(v)));
    this.scrollBottom();
  }

  holdHandler(e, chat, msg, i){
    if(e == 500){
      console.log('longpressed');
      this.currentGroup = chat;
      this.currentMsg = msg;
      this.currentI = i;

      this.showMobileDeleteWindow = true;
    }
  }

  submitHand(chat) {
    this.roomService.sendMessageHand(chat.id);
    // this.updateMessageSeen(chat);
    this.newMsg = '';
    this.scrollBottom();
  }

  returnDate(timestamp) {
    let date = new Date(timestamp);
    let string = date.getHours() + ":" + date.getMinutes();
    return string;
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
    const chatElem = document.getElementById('chat');
    if (chatElem) {
      setTimeout(() => {
        chatElem.scrollTop = chatElem.scrollHeight;
      }
        , 500);
    }
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
  cancelDelete() {
    this.showMobileDeleteWindow = false;
  }

  clickedDelete(chat, msg, i){
    msg.deleteWindow = false;
    this.roomService.updateMessage(chat, msg, i);
  }

  deleteMessage(){
    this.roomService.updateMessage(this.currentGroup, this.currentMsg, this.currentI);
  }


}
