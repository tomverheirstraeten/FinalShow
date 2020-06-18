import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-adminrooms',
  templateUrl: './adminrooms.component.html',
  styleUrls: ['./adminrooms.component.scss']
})
export class AdminroomsComponent implements OnInit {

  allRooms: any = [];

  constructor(public service: AdminService, private router: Router) {
    if(sessionStorage.getItem('password') != environment.credentials.password){
      this.router.navigate(['admin'])
    }
    this.getRooms();
  }
  ngOnInit() {
    this.getRooms();
  }
  ngOnChanges() {
    this.getRooms();
  }
  getRooms(){
    this.service.getRooms().subscribe((rooms) => {
      this.allRooms = rooms;
    });
  }

}
