import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';


@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit, AfterViewInit {

  timetable: Array<object>;
  isDesktop: boolean;
  eventHeight: number;
  eventPositions: Array<number>;
  previousSelectedHtmlEvent: Element;
  previousSelectedHtmlEventDetails: Element;

  @ViewChild('timetableHtmlList') timetableHtmlList: ElementRef;
  @ViewChildren('eventListItems') eventListItems: QueryList<any>;

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

      // elememet currently targeted
      const currentEvent = this.timetable.find(event => event['scrollHeight'] === closest);
      this.showSelectedHtmlEvent(currentEvent);
    }
  }

  // color selected list element in the html
  showSelectedHtmlEvent(currentEvent){
    const currentSelectedEventHtml = document.getElementById(currentEvent['name']);
    if(currentSelectedEventHtml != this.previousSelectedHtmlEvent){
      // timetable list
      this.previousSelectedHtmlEvent.classList.remove("selectedEvent");
      this.previousSelectedHtmlEvent = currentSelectedEventHtml;
      currentSelectedEventHtml.classList.add("selectedEvent");

      // details
      this.previousSelectedHtmlEventDetails.classList.add('hidden');
      const currentSelectedEventDetailHtml = document.getElementById('desktop-event-' + currentEvent['name']);
      currentSelectedEventDetailHtml.classList.remove("hidden");
      this.previousSelectedHtmlEventDetails = currentSelectedEventDetailHtml;
    }
    
  }

  // save nessasary scroll values
  getScrollValues () {
      this.eventHeight = 94;

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
        this.timetable[index]['scrollHeight'] = value;
        return value;
      });
  };

  ngOnInit(): void {
    if (window.screen.width >= 769) {
      this.isDesktop = true;
    }
  }

  ngAfterViewInit() {
    // executes after list load
    // solution from: https://stackoverflow.com/questions/37087864/execute-a-function-when-ngfor-finished-in-angular-2
    this.eventListItems.changes.subscribe(t => {
      this.getScrollValues ();
      
      const eventsDetailsDivs = document.getElementsByClassName("desktop-event");
      this.previousSelectedHtmlEventDetails = eventsDetailsDivs.item(0);
      for(let i = 1; i < eventsDetailsDivs.length; i++){
        eventsDetailsDivs[i].classList.add('hidden');
        console.log(eventsDetailsDivs[i]);
      }

      this.previousSelectedHtmlEvent = this.eventListItems.first.nativeElement.childNodes[2]
      this.previousSelectedHtmlEvent.classList.add("selectedEvent");
    })
  }

}
