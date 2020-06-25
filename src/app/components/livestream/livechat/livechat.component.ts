import { Component, OnInit, OnChanges, AfterViewInit, AfterViewChecked, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-livechat',
  templateUrl: './livechat.component.html',
  styleUrls: ['./livechat.component.scss']
})
export class LivechatComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  chat$: Observable<any>;
  newMsg: any;
  myScrollContainer: any;
  disableScrollDown = true;
  count = 0;
  container: HTMLElement;
  allChatsSub: Subscription;
  liveChatSub: Subscription;

  // livestreamID = "ALqUn9fy9fWieiwvEFOk";
  // livestreamID = "xWsddAUZ7AFFUOVJ9Muv";
  livestreamID = 'w496ZugdV52nd8HPPixA';

  constructor(private route: ActivatedRoute,
    public auth: AuthService,
    public userService: UsersService,
    public roomService: RoomsService) {
     }
  ngOnDestroy() {
    if(this.allChatsSub !== undefined){
      this.allChatsSub.unsubscribe();
      }
      if(this.liveChatSub !== undefined){
        this.liveChatSub.unsubscribe();
        }


  }

  ngOnChanges() {
    this.scrollBottom();
  }
  ngAfterViewInit() {
    console.log('afterView');
    this.scrollBottom();
  }

  @HostListener('window:load', ['$event']) onPageLoad(event: Event) {
    // this.scrollBottom();

    setTimeout(() => {
      console.log('loaded');
      this.scrollBottom();
    }, 2000);

  }

  ngOnInit() {
    this.getAllChats();
    this.liveChatSub = this.roomService.get(this.livestreamID).subscribe(res => {
      this.scrollBottom();
    })
    const source = this.roomService.get(this.livestreamID)
    this.chat$ = this.roomService.joinUsers(source);
  }

  getAllChats() {
   this.allChatsSub =  this.roomService.get(this.livestreamID).subscribe(res => {
      this.scrollBottom();
    })
  }

  submitHand(chat) {
    this.roomService.sendMessageHand(this.livestreamID);
    this.newMsg = '';
    this.scrollBottom();
  }




  submit(chatId) {
    console.log(this.newMsg)
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


  private scrollBottom() {
    const chatElem = document.getElementById('livechat-container');
    console.log(chatElem);
    if (chatElem) {
      setTimeout(() => {
        console.log('scroll');
        chatElem.scrollTop = chatElem.scrollHeight;
      }
        , 500);
    }
  }
  
}
