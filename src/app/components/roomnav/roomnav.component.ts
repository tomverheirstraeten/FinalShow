import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roomnav',
  templateUrl: './roomnav.component.html',
  styleUrls: ['./roomnav.component.scss']
})
export class RoomnavComponent implements OnInit {
  rooms: { name: string, link: string, image: string }[] = [
    {
      name: 'Livestream',
      link: '/livestream',
      image: 'medialab.png'
    },
    {
      name: 'Help Center',
      link: '/faq',
      image: 'fablab.png'
    },
    {
      name: 'Chatrooms',
      link: '/network',
      image: 'conversationroom.png'
    },
    {
      name: 'Timetable',
      link: '/timetable',
      image: 'entrance.png'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
