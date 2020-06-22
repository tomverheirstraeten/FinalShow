import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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
  ];
  @ViewChild('slidercontainer') slidercontainer: ElementRef;
  
  ngAfterViewInit() {
    const viewWidth =  this.slidercontainer.nativeElement.clientWidth;
    const previousLocation = sessionStorage.getItem('rooms_scroll_x_position');
    this.slidercontainer.nativeElement.scrollTo(previousLocation, 0);
  }

  rememberScrollPosition(){
    const scrollPosition = this.slidercontainer.nativeElement.scrollLeft;
    sessionStorage.setItem('rooms_scroll_x_position', scrollPosition);
  }

  constructor() { }

  ngOnInit(): void {
  
  }

}
