import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-adminroom',
  templateUrl: './adminroom.component.html',
  styleUrls: ['./adminroom.component.scss']
})
export class AdminroomComponent implements OnInit {

  roomId;
  roomName = '';
  room: any;
  messages = new Array();
  users;
  autoscroll = true;

  constructor(private route: ActivatedRoute, private service: AdminService, private router: Router) {
    if (sessionStorage.getItem('password') != environment.credentials.password) {
      this.router.navigate([''])
    }
  }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.getMessages();
    this.scrollBottom();
  }

  ngOnChanges() {
    this.getMessages();
  }

  getMessages() {
    this.service.getRoom(this.roomId).subscribe((roomData) => {
      this.room = roomData;
      this.roomName = roomData['roomName'] + ' Room';
      this.messages = this.service.getUsers(roomData['messages']);
      console.log(this.messages);
      if(this.autoscroll === true){
        this.scrollBottom();
      }
    });
  }

  returnDate(timestamp) {
    let date = new Date(timestamp);
    let string = date.getHours() + ":" + date.getMinutes();
    return string;
  }

  deleteMessage(index) {
    if (confirm('Are you sure you want to delete this message?')) {
      let newArray = this.messages;
      newArray[index].originalContent = newArray[index].content;
      newArray[index].content = 'Dit bericht werd verwijderd door een moderator';
      newArray[index].deleted = true;
      this.service.updateMessages(this.roomId, newArray);
    }
  }

  revertMessage(index) {
    if (confirm('Are you sure you want to restore this message?')) {
      let newArray = this.messages;
      newArray[index].content = newArray[index].originalContent;
      newArray[index].deleted = false;
      this.service.updateMessages(this.roomId, newArray);
    }
  }

  scrollDetect() {
    const chatElem = document.getElementById('chat');

    // bottem scroll detect: https://stackoverflow.com/questions/41304968/how-to-get-on-scroll-events
    if (chatElem.scrollHeight - chatElem.scrollTop === chatElem.clientHeight) {
      this.autoscroll = true;
    } else {
      this.autoscroll = false;
    }

  }

  private scrollBottom() {

    const chatElem = document.getElementById('chat');

    if (chatElem) {
      setTimeout(() => chatElem.scrollTop = chatElem.scrollHeight, 500);
    }

    // setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }

}
