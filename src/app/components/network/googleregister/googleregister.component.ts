import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-googleregister',
  templateUrl: './googleregister.component.html',
  styleUrls: ['./googleregister.component.scss']
})
export class GoogleregisterComponent implements OnInit {
  user;
  id;
  character;
  registerGoogleForm = new FormGroup({
    website: new FormControl(''),
    functie: new FormControl('', [Validators.required]),
    bio: new FormControl(''),
    gdpr: new FormControl('', [Validators.required])
  });
  GoogleHidden = true;
  routeSub: any;
  position = 0;
  positionStyle = "";

  mobile = false;

  constructor(public auth: AuthService,
              public userService: UsersService,
              private formBuilder: FormBuilder,
              public route: Router, public router: ActivatedRoute) {
                if(screen.width < 768){
                  this.mobile = true;
                }

  }

  ngOnInit() {
    this.routeSub = this.router.params.subscribe(params => {
      this.id = params.id;
    });
    this.checkIfUser();



  }

  ngOnDestroy() {
    if (this.routeSub !== undefined) {
      this.routeSub.unsubscribe();
    }


  }

  async checkIfUser() {
    this.user = await this.auth.getUser();
    if (!this.user) {
    this.goToLogin();
    }
  }

  goToHome() {
    this.route.navigate(['/network']);
  }
  goToLivestream() {
    this.route.navigate(['/livestream']);
  }


  GoogleRegister(formVal) {
    console.log(this.registerGoogleForm);
    if (this.registerGoogleForm.valid) {
      this.auth.googleUpdate(formVal, this.id, this.character);
    }
  }
  ngOnChanges() {
    if (this.auth.userId) {
      this.goToHome();
    }

  }

  ToggleForm() {
    this.GoogleHidden = !this.GoogleHidden;
  }

  setActiveCharacter(character){
    this.character = character;
    console.log(this.character);
  }
  goleft() {
    if(this.position < 0){
      this.position += 100;
      this.positionStyle = this.position + "%";
    }

  }
  goright() {
    if(this.position >= -300){
      this.position -= 100;
      this.positionStyle = this.position + "%";
    }
  }
  goToLogin() {
    this.route.navigate(['/login']);
  }
}
