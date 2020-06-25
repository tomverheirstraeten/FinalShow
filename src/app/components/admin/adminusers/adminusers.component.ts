import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { environment } from 'src/environments/environment';

import * as _ from 'lodash';
import { Router } from '@angular/router';
import { env } from 'process';

@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.scss']
})
export class AdminusersComponent implements OnInit {

  users: Array<object>;
  userLength = 0;

  constructor(private service: AdminService, private router: Router) {
    if(sessionStorage.getItem('password') != environment.credentials.password){
      this.router.navigate(['admin'])
    }
    this.getUsers();
  }

  ngOnChanges() {
    this.getUsers();
  }

  getUsers(){
    this.service.getAllUsers().subscribe((userData) => {
      this.users = _.orderBy(userData, 'displayName', 'asc');
      this.userLength = this.users.length;
      console.log(userData);
    }).unsubscribe();
  }

  deleteUser(uId, name){
    if(confirm("Are you sure you want to delete "+ name + "?")) {
      this.service.deleteUser(uId);
      this.deleteUserMessages(uId);
      this.service.deleteChats(uId);
    }
  }

  deleteUserMessages(uId){
    this.service.getRooms().subscribe((rooms) => {
      rooms.forEach(room => {
        let messages = room['messages'];
        _.remove(messages, function(e){
          return e.uid == uId;
        })
        this.service.updateMessages(room.id, messages);
      });
    }).unsubscribe();
  }

  updateUser(uId){
    const elements = document.getElementsByClassName(uId);
    const role = elements[0] as HTMLInputElement;
    const roleVal = role.value;
    const admin = elements[1] as HTMLInputElement;
    const adminVal = admin.checked;
    this.service.updateUser(uId, roleVal, adminVal);
  }

  ngOnInit(): void {
  }

}
