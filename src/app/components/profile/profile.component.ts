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

  setActiveCharacter(newCharacter) {
    this.character = newCharacter;
    console.log(this.character);
    const clickedAvatar: HTMLInputElement = document.getElementById(newCharacter) as HTMLInputElement;
    clickedAvatar.checked = true;
  }

  fillInUserData(currentUser) {
    this.id = currentUser.uid;
    const elementName: HTMLInputElement = document.getElementById('name') as HTMLInputElement;
    const elementWebsite: HTMLInputElement = document.getElementById('website') as HTMLInputElement;
    const elementFunctie: HTMLInputElement = document.getElementById('function') as HTMLInputElement;
    const elementBio: HTMLInputElement = document.getElementById('bio') as HTMLInputElement;
    const elementAvatar: HTMLInputElement = document.getElementById(currentUser.character) as HTMLInputElement;

    elementName.value = currentUser.displayName;
    elementWebsite.value = currentUser.website;
    elementBio.value = currentUser.bio;
    elementFunctie.value = currentUser.function;
    elementAvatar.checked = true;

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
