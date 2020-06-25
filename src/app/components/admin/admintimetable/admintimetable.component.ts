import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { DOCUMENT } from '@angular/common';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-timetable',
  templateUrl: './admintimetable.component.html',
  styleUrls: ['./admintimetable.component.scss']
})
export class AdmintimetableComponent implements OnInit {

  timetable: Array<object>;

  constructor(private service: AdminService, @Inject(DOCUMENT) document, private router: Router) {
    if(sessionStorage.getItem('password') != environment.credentials.password){
      this.router.navigate(['admin'])
    }
    this.getTimetable();
  }

  getTimetable(){
    this.service.getTimetable().subscribe((timetableData) => {
      this.timetable = _.orderBy(timetableData, 'time', 'asc');
      console.log(timetableData);
    }).unsubscribe();
  }

  clickActive(id){
    this.service.setActive(id, this.timetable);
  }

  clickNotification(id){
    const elements = document.getElementsByClassName(id);
    const name = elements[1] as HTMLInputElement;
    const nameVal = name.value;
    if(confirm('Are you sure you want to send the notification for ' + nameVal + '?')){
      this.service.sendAutomaticNotification(nameVal);
      alert('The notification has been sent.')
    }
  }

  clickRemove(name, id){
    if(confirm('Are you sure you want to delete ' + name + '?')){
      this.service.deleteTimetableField(id);
    }
  }

  clickUpdate(id){
    const elements = document.getElementsByClassName(id);
    const time = elements[0] as HTMLInputElement;
    const timeVal = time.value;
    const name = elements[1] as HTMLInputElement;
    const nameVal = name.value;
    const desc = elements[2] as HTMLInputElement;
    const descVal = desc.value;
    this.service.updateTimetableField(id, timeVal, nameVal, descVal);
  }

  clickAdd(){
    const time = document.getElementById('time') as HTMLInputElement;
    const timeVal = time.value;
    const name = document.getElementById('name') as HTMLInputElement;
    const nameVal = name.value;
    const desc = document.getElementById('desc') as HTMLInputElement;
    const descVal = desc.value;
    this.service.addTimetableField(timeVal, nameVal, descVal);

    time.value = null;
    name.value = null;
    desc.value = null;
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
  }
}
