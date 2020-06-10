import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentRoom = 0;

  linkList = ['/livestream', '/faq', '/network'];
  nameList = ['Livestream', 'Help Center', 'Netwerk'];

  currentLink = '/livestream';
  currentName = 'Livestream';
  currentImage = 'assets/images/room0.png';

  constructor() { }

  nextRoom(next: boolean) {
    if (next) { // this just makes sure the arrows move the rooms in a different direction
      this.currentRoom = (this.currentRoom - 1) % 3;
    } else {
      this.currentRoom = (this.currentRoom + 1) % 3;
    }


    let roomNumber = this.currentRoom;
    if(this.currentRoom < 0){
      // if it's a negative number, make it positive so you can use it as an index for the linkList and nameList arrays
      roomNumber = Math.abs(this.currentRoom);
    }
    this.currentLink = this.linkList[roomNumber];
    this.currentName = this.nameList[roomNumber];
    this.currentImage = 'assets/images/room' + roomNumber + '.png';

  }

  ngOnInit(): void {
  }

}
