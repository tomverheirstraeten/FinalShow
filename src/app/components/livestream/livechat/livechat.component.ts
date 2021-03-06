import { Component, OnInit, OnChanges, AfterViewInit, AfterViewChecked, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-livechat',
  templateUrl: './livechat.component.html',
  styleUrls: ['./livechat.component.scss']
})
export class LivechatComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  chat;
  newMsg: any;
  myScrollContainer: any;
  disableScrollDown = true;
  count = 0;
  container: HTMLElement;
  allChatsSub: Subscription;
  liveChatSub: Subscription;

  // livestreamID = "ALqUn9fy9fWieiwvEFOk";
  // livestreamID = "xWsddAUZ7AFFUOVJ9Muv";
  livestreamID = environment.livestreamID.id;

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
    this.scrollBottom();
  }

  @HostListener('window:load', ['$event']) onPageLoad(event: Event) {
    // this.scrollBottom();

    setTimeout(() => {
      this.scrollBottom();
    }, 500);
  }

  ngOnInit() {
    this.getAllChats();
    //const source = this.roomService.get(this.livestreamID)
    //this.chat$ = this.roomService.joinUsers(source);
  }

  getAllChats() {
   this.allChatsSub =  this.roomService.get(this.livestreamID).subscribe(res => {
     this.chat = res;
      this.scrollBottom();
    })
  }

  submitHand(chat) {
    this.roomService.sendMessageHand(this.livestreamID);
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
    return msg.createdAt;
  }


  private scrollBottom() {
    const chatElem = document.getElementById('livechat-container');
    if (chatElem) {
      setTimeout(() => {
        console.log('scroll');
        chatElem.scrollTop = chatElem.scrollHeight;
      }
        , 500);
    }
  }

}
