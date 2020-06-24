import { Component, OnInit, SecurityContext } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { AdminService } from 'src/app/services/admin.service';
import { formatDate, CommonModule } from '@angular/common';
import * as _ from 'lodash';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss']
})
export class LivestreamComponent implements OnInit {

  room = 'live stream';
  currentActivity = 'Offline';
  live = false;
  timetable;
  url;

  constructor(private ns: NotificationService, private as: AdminService, private sanitizer: DomSanitizer) {
    this.as.getStreamUrl().subscribe(val => {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(val['url']);
      console.log(this.url);
    })
    this.as.getTimetable().subscribe((timetableData) => {
      this.timetable = _.orderBy(timetableData, 'time', 'asc');
      this.showCurrentActivity();
    });
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

  ngOnInit(): void {

  }


}
