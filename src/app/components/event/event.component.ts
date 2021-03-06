import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {

  eventName: string;
  data;
  isDesktop: boolean;
  eventSub: Subscription;
  constructor(private route: ActivatedRoute, public service: AdminService) {  }
  ngOnDestroy() {

    if(this.eventSub !== undefined){
      this.eventSub.unsubscribe();
      }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventName = params.get('event'); // get the name from the url
      console.log(this.eventName);

      this.eventSub =  this.service.getEventByName(this.eventName).subscribe(val => {
        this.data = val;
        console.log(val);
      });
    });

    if (window.screen.width >= 769) {
      this.isDesktop = true;
    }
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
