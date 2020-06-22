import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';

@Component({
  selector: 'app-desktopevent',
  templateUrl: './desktopevent.component.html',
  styleUrls: ['./desktopevent.component.scss']
})
export class DesktopeventComponent implements OnInit {

  eventName: string;
  @Input() timeTable;
  constructor(public service: DatabaseService) {  }

  ngOnInit(): void {

    }
  }


