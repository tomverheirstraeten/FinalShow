import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-adminnotifications',
  templateUrl: './adminnotifications.component.html',
  styleUrls: ['./adminnotifications.component.scss']
})
export class AdminnotificationsComponent implements OnInit {

  permaNotif;

  constructor(private service: AdminService, private router: Router) {
    if(sessionStorage.getItem('password') != environment.credentials.password){
      this.router.navigate(['admin'])
    }
    this.getPermanentNotifications();
  }

  getPermanentNotifications(){
    this.service.getPermanentNotifications().subscribe((val) => {
      this.permaNotif = val;
      console.log(val);
    })
  }

  deleteNotification(id){
    if(confirm('Are you sure you want to delete this notification?')){
      this.service.deleteNotification(id);
    }
  }

  sendNotification(message, colorCode, permanent, icon){

    const rooms: any = document.getElementsByClassName('rooms-visible');
    let selectedRooms = [];
    for(let room of rooms){
      if(room.checked){
        selectedRooms.push(room.value);
        room.checked = false;
      }
    }

    this.service.sendNotification(message, colorCode, selectedRooms, permanent, icon);
    document.getElementById('message').textContent = null;
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

  ngOnInit() {
  }

}
