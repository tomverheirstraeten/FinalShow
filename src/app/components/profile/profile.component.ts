import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user = {};

  data = {
    name: 'jules',
    website: 'julesdocx.be',
    bio: 'tof',
    rol: 'student',
  };

  constructor(public userservice: UsersService, public authservice: AuthService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.user = this.authservice.getUser();
    console.log(this.user);
  }
}
