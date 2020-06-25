import { Component, OnInit, SecurityContext, OnDestroy, Inject, HostListener, AfterViewInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { AdminService } from 'src/app/services/admin.service';
import { formatDate, CommonModule, DOCUMENT } from '@angular/common';
import * as _ from 'lodash';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss']
})
export class LivestreamComponent implements OnInit, OnDestroy, AfterViewInit {

  room = 'live stream';
  currentActivity = 'Offline';
  live = false;
  timetable;
  url;
  LiveStreamUrlSub: Subscription;
  timeTableSub: Subscription;
  mobile = false;
  constructor(private ns: NotificationService, private as: AdminService, private sanitizer: DomSanitizer, @Inject(DOCUMENT) document) {
    if(screen.width < 768){
      this.mobile = true;
    }
    this.LiveStreamUrlSub =  this.as.getStreamUrl().subscribe(val => {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(val['url']);
      console.log(this.url);
    });
    this.timeTableSub = this.as.getTimetable().subscribe((timetableData) => {
      this.timetable = _.orderBy(timetableData, 'time', 'asc');
      this.showCurrentActivity();
    });
  }

  ngOnDestroy() {
    if(this.LiveStreamUrlSub !== undefined){
      this.LiveStreamUrlSub.unsubscribe();
      }
      if(this.timeTableSub !== undefined){
        this.timeTableSub.unsubscribe();
        }
  }

  showCurrentActivity(){
    this.currentActivity = 'Offline';
    this.live = false;
    this.timetable.forEach(timeslot => {
      if(timeslot.active){
        this.currentActivity = timeslot.name;
        this.live = true;
      }
    });
  }

  returnTime(time){
    let date = new Date(time.seconds * 1000);
    let hours = date.getHours();
    let hourString: string;
    if(hours < 10) {
      hourString = '0' + hours.toString();
    } else {
      hourString = hours.toString();
    }

    let minutes = date.getMinutes();
    let minuteString: string;
    if(minutes < 10) {
      minuteString = '0' + minutes.toString();
    } else {
      minuteString = minutes.toString();
    }

    return hourString + ':' + minuteString;
  }

  resizeLivestream(){
      const video = document.getElementById('video');
      const head = document.getElementById('head');
      const chat = document.getElementById('chat');
      let height = video.offsetHeight + head.offsetHeight + (window.innerWidth / 100);
      chat.style.height = height.toString() + 'px';
  }

  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.resizeLivestream();
    }

    ngAfterViewInit(){
      this.resizeLivestream();

    }

  ngOnInit(): void {
    //this.resizeLivestream();
  }

}
