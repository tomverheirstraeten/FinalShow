import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';


@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  timetable: Array<object>;
  isDesktop: boolean;
  maxScroll: number;
  eventHeight: number;
  eventPositions: Array<number>;

  @ViewChild('timetableHtmlList') timetableHtmlList: ElementRef;

  constructor(private service: DatabaseService) {
    this.timetable = service.getTimetable();
  }


  displayTime(time) {
    let date = new Date(time.seconds * 1000);
    let hours = date.getHours();
    let hourString: string;
    if (hours < 10) {
      hourString = '0' + hours.toString();
    } else {
      hourString = hours.toString();
    }

    let minutes = date.getMinutes();
    let minuteString: string;
    if (minutes < 10) {
      minuteString = '0' + minutes.toString();
    } else {
      minuteString = minutes.toString();
    }

    return hourString + ':' + minuteString;

  }

  showEvent() {
    if (this.isDesktop) {
      // scroll values
      let scrollPosition = this.timetableHtmlList.nativeElement.scrollTop;

      // find closest value
      // function from: https://stackoverflow.com/questions/8584902/get-closest-number-out-of-array
      var closest = this.eventPositions.reduce(function (prev, curr) {
        return (Math.abs(curr - scrollPosition) < Math.abs(prev - scrollPosition) ? curr : prev);
      });

      console.log(closest);
      console.log(scrollPosition);
    }
  }

  init () {
    if (window.screen.width >= 769) {
      this.isDesktop = true;

      this.maxScroll = this.timetableHtmlList.nativeElement.scrollHeight - this.timetableHtmlList.nativeElement.clientHeight;
      this.eventHeight = this.maxScroll / this.timetable.length;

      console.log(this.maxScroll);
      console.log(this.eventHeight);

      // get event positions in the html.
      let valueCounter = 0;
      this.eventPositions = this.timetable.map((event, index) => {
        let value = 0;
        if (index != 0) {
          value = valueCounter + this.eventHeight;
          valueCounter += this.eventHeight;
        } else {
          value = valueCounter;
        }
        return value;
      });
      console.log(this.eventPositions);
    }
  };

  ngOnInit(): void {
    if (window.screen.width >= 769) {
      this.isDesktop = true;
    }
  }

  

}
