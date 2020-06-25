import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  character;

  user = {};

  id;

  position = 0;
  positionStyle = '';


  constructor(private auth: AuthService, private router: Router, private adminservice: AdminService) { }

  updateProfileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    website: new FormControl(''),
    functie: new FormControl('', [Validators.required]),
    bio: new FormControl(''),
  });

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
      this.goToLogin();
    }
  }
  
  updateProfile(formVal) {
    if (this.updateProfileForm.valid) {
    this.adminservice.updateProfile(this.id, this.character, formVal.name, formVal.bio, formVal.functie, formVal.website);
    }
  }


  setActiveCharacter(character) {
    this.character = character;
  }

  fillInUserData(currentUser) {
    console.log(currentUser.displayName);
    this.id = currentUser.uid;
    const elementName = document.getElementById('name');
    const elementWebsite = document.getElementById('website');
    const elementFunctie = document.getElementById('function');
    const elementBio = document.getElementById('bio');
    const elementAvatar: HTMLInputElement = document.getElementById(currentUser.character) as HTMLInputElement;
    if (currentUser) {
      elementName.setAttribute('value', currentUser.displayName);
      elementWebsite.setAttribute('value', currentUser.website);
      elementBio.innerHTML = currentUser.bio;
      elementFunctie.setAttribute('value', 'bedrijf');
      elementAvatar.checked = true;
    } else {
      this.goToLogin();
    }

  }

  goleft() {
    if (this.position < 0){
      this.position += 100;
      this.positionStyle = this.position + '%';
    }

  }
  goright() {
    if (this.position >= -300){
      this.position -= 100;
      this.positionStyle = this.position + '%';
    }

  }
  goToLogin() {
    this.router.navigate(['/login']);
  }


}
