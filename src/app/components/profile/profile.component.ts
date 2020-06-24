import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  character;

  user = {};

  data = {
    name: 'jules',
    website: 'julesdocx.be',
    bio: 'tof',
    rol: 'student',
  };

  constructor() { }

  ngOnInit(): void {
  }

  setActiveCharacter(character){
    this.character = character;
    console.log(this.character);
  }
}
