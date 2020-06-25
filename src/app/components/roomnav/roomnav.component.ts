import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
// import {state, style, transition, animate, trigger } from '@angular/animations';

@Component({
  selector: 'app-roomnav',
  templateUrl: './roomnav.component.html',
  styleUrls: ['./roomnav.component.scss'],
  // animations: [
  //   trigger('scroll', [
  //   state('center', style({
  //     left: 0
  //   })),
  //   state('left', style({
  //     left: '-50vw'
  //   })),
  //   transition('left <=> center', [ animate('0.5s')])
  // ])
  // ]
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

  // returnState(room) {


  // }
  changeOverlap() {
    const scrollPosition = this.slidercontainer.nativeElement.scrollLeft;
    this.getPosition(scrollPosition);
    // const center = document.getElementById('1');
  }


  getPosition(scroll) {
    const viewWidth =  this.slidercontainer.nativeElement.clientWidth;
    if (scroll < viewWidth) {
      console.log('0');
      return 0;
    }
    if (scroll < viewWidth * 2) {
      console.log('1');
      return 1;
    }
    if (scroll < viewWidth * 3) {
      console.log('2');
      return 2;
    }
    if (scroll < viewWidth * 4) {
      console.log('4');
      return 4;
    }

  }

  // overlap(position) {
  //   const scrollPosition = this.slidercontainer.nativeElement.scrollLeft;
  //   if(position == 1 && scrollPosition == 320){
  //     console.log('changing style)');
  //     return "{'background-color': 'red'}";
  //   }
  // }
  constructor() { }

  ngOnInit(): void {
  
  }

}
