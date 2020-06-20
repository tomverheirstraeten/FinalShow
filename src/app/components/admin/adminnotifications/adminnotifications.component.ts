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

  constructor(private service: AdminService, private router: Router) {
    if(sessionStorage.getItem('password') != environment.credentials.password){
      this.router.navigate(['admin'])
    }
  }

  sendNotification(message, colorCode, permanent){

    const rooms: any = document.getElementsByClassName('rooms-visible');
    let selectedRooms = [];
    for(let room of rooms){
      if(room.checked){
        selectedRooms.push(room.value);
        room.checked = false;
      }
    }

    this.service.sendNotification(message, colorCode, selectedRooms, permanent);
    document.getElementById('message').textContent = null;
  }

  ngOnInit() {
  }

}
