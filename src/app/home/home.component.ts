import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentRoom = 0;

  roomNumbers = [0,1,2,3];
  linkList = ['/livestream', '/faq', '/network', '/timetable'];
  nameList = ['Livestream', 'Help Center', 'Netwerk', 'timetable'];
  imageList = ['medialab.png', 'fablab.png', 'room0.png', 'room1.png']

  currentLink = this.linkList[0];
  currentName = this.nameList[0];
  currentImage = 'assets/images/' + this.imageList[0];

  constructor() { }

  nextRoom(next: boolean) {
    if (next) { // this just makes sure the arrows move the rooms in a different direction
      this.currentRoom = (this.currentRoom - 1) % 4;
    } else {
      this.currentRoom = (this.currentRoom + 1) % 4;
    }


    let roomNumber = this.currentRoom;
    if(this.currentRoom < 0){
      // if it's a negative number, make it positive so you can use it as an index for the linkList and nameList arrays
      roomNumber = Math.abs(this.currentRoom);
    }
    this.currentLink = this.linkList[roomNumber];
    this.currentName = this.nameList[roomNumber];
    this.currentImage = 'assets/images/' + this.imageList[roomNumber];

  }

  ngOnInit(): void {
  }

}
