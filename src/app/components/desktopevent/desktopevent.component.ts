import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-desktopevent',
  templateUrl: './desktopevent.component.html',
  styleUrls: ['./desktopevent.component.scss']
})
export class DesktopeventComponent implements OnInit {

  eventName: string;
  @Input() timeTable;
  constructor(public service: AdminService) {  }

  ngOnInit(): void {

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


}


