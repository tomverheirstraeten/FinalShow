import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  character;

  user = {};

  id;

  updateProfileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    website: new FormControl(''),
    functie: new FormControl('' , [Validators.required]),
    bio: new FormControl(''),
  });

  position = 0;
  positionStyle = '';

  currentUser;


  constructor(
    private _location: Location,
    private auth: AuthService,
    private router: Router,
    private adminservice: AdminService) { }


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
    console.log(this.id, this.character, formVal.name, formVal.bio, formVal.functie, formVal.website);
    if (this.updateProfileForm.valid) {
    this.adminservice.updateProfile(this.id, this.character, formVal.name, formVal.bio, formVal.functie, formVal.website);
    }
  }

  setActiveCharacter(newCharacter) {
    this.character = newCharacter;
    console.log(this.character);
    const clickedAvatar: HTMLInputElement = document.getElementById(newCharacter) as HTMLInputElement;
    clickedAvatar.checked = true;
  }

  fillInUserData(currentUser) {
    this.id = currentUser.uid;
    this.character = currentUser.character;
    const elementAvatar: HTMLInputElement = document.getElementById(currentUser.character) as HTMLInputElement;
    elementAvatar.checked = true;
    this.updateProfileForm = new FormGroup({
      name: new FormControl(currentUser.displayName, [Validators.required]),
      website: new FormControl(currentUser.website),
      functie: new FormControl(currentUser.function , [Validators.required]),
      bio: new FormControl(currentUser.bio),
    });

  }

  goBack() {
    this._location.back();
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

  signOut() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }


}
