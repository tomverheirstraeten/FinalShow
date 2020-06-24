import { Component, OnInit, OnChanges, AfterViewInit, AfterViewChecked, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Observable, of } from 'rxjs';
import { take, takeLast } from 'rxjs/operators';

@Component({
  selector: 'app-livechat',
  templateUrl: './livechat.component.html',
  styleUrls: ['./livechat.component.scss']
})
export class LivechatComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  chat$: Observable<any>;
  newMsg: any;
  myScrollContainer: any;
  disableScrollDown: boolean = true;
  count = 0
  livestreamID = "ALqUn9fy9fWieiwvEFOk";
  // livestreamID = "xWsddAUZ7AFFUOVJ9Muv";

  constructor(private route: ActivatedRoute,
              public auth: AuthService,
              public userService: UsersService,
              public roomService: RoomsService) { }
  ngOnChanges() {
    this.scrollBottom();
  }
  ngAfterViewInit() {
    this.scrollBottom()

  }
  ngAfterViewChecked() {
this.count++;
    if(this.count === 5){
      if (this.disableScrollDown) {
        this.scrollBottom();
        this.disableScrollDown = false;
      }
    }


  }
  @HostListener('load', ['$event']) onPageLoad(event: Event) {
    this.scrollBottom();
  }
  ngOnInit() {
    this.getAllChats();
    this.roomService.get(this.livestreamID).subscribe(res =>{
      this.scrollBottom();
    });
    const source = this.roomService.get(this.livestreamID)
    this.chat$ = this.roomService.joinUsers(source);


  }

  getAllChats(){
    this.roomService.get(this.livestreamID).subscribe(res => {
      this.scrollBottom();
    });

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

      if (chatElem) {
        setTimeout(() => chatElem.scrollTop = chatElem.scrollHeight, 500);
      }


  }
}
