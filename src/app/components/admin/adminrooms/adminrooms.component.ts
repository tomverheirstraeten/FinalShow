import { Component, OnInit, INJECTOR, Inject, OnDestroy } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adminrooms',
  templateUrl: './adminrooms.component.html',
  styleUrls: ['./adminrooms.component.scss']
})
export class AdminroomsComponent implements OnInit, OnDestroy {

  allRooms: any = [];
  roomSub: Subscription;

  constructor(public service: AdminService, private router: Router, @Inject(DOCUMENT) document) {
    if(sessionStorage.getItem('password') != environment.credentials.password){
      this.router.navigate(['admin'])
    }
    this.getRooms();
  }
  ngOnDestroy() {
    if(this.roomSub !== undefined){
      this.roomSub.unsubscribe();
      }
  }
  ngOnInit() {
    this.getRooms();
  }

  ngOnChanges() {
    this.getRooms();
  }

  getRooms(){
   this.roomSub =  this.service.getRooms().subscribe((rooms) => {
      this.allRooms = rooms;
    })
  }

  createRoom(){
    const name = document.getElementById('name') as HTMLInputElement;
    const nameVal = name.value;
    this.service.createRoom(nameVal);

    name.value = null;
  }

  deleteRoom(id, name){
    if(confirm('Are you sure you want to delete ' + name + '?')){
      this.service.deleteRoom(id);
    }
  }

}
