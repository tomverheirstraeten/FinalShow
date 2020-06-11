import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  eventName: string;
  data;

  constructor(private route: ActivatedRoute, public service: DatabaseService) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventName = params.get('event'); // get the name from the url
      console.log(this.eventName);

      this.data = this.service.getEventByName(this.eventName);
    });


  }




}
