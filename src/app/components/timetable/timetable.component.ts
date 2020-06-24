import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  timetable: Array<object>;
  isDesktop: boolean;

  constructor(private service: AdminService) {
    this.service.getTimetable().subscribe((timetableData) => {
      this.timetable = _.orderBy(timetableData, 'time', 'asc');
      console.log(timetableData);
    });
  }


  displayTime(time){
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
    if (window.screen.width >= 769) {
      this.isDesktop = true;
    }
  }

}
