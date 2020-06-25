import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  character;

  user: Observable < any > ;


  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.getUser();

  }

  async getUser() {
    const currentUser = await this.auth.getUser();
    if (currentUser) {
      console.log(currentUser);
      this.user = currentUser;
      this.fillInUserData(currentUser);
    } else {
      console.log('nouser');
    }
  }

  setActiveCharacter(character) {
    this.character = character;
    console.log(this.character);
  }

  fillInUserData(currentUser) {
    const elementName = document.getElementById('name');
    const elementWebsite = document.getElementById('website');
    const elementFunctie = document.getElementById('function');
    const elementBio = document.getElementById('bio');
   // const elementAvatar = document.getElementById('avatar');
    if (currentUser) {
      elementName.setAttribute('value', currentUser.displayName);
      elementWebsite.setAttribute('value', currentUser.website);
      elementBio.innerHTML = currentUser.bio;
      elementFunctie.setAttribute('value', 'bedrijf');
      // elementAvatar.setAttribute('value', currentUser.di);
    } else {
      console.log('nouser, in ProfileComponent.fillInUserData()');
    }

  }
}
