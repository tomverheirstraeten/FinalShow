import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy
} from '@angular/core';

import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from '@angular/forms';
import {
  Router, ActivatedRoute
} from '@angular/router';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  UsersService
} from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnChanges, OnDestroy {
  user;
  id;
  character;

  error;

  mobile = false;

  registerEmailForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    website: new FormControl(''),
    functie: new FormControl('', [Validators.required]),
    bio: new FormControl(''),
    gdpr: new FormControl('', [Validators.required])
  });
  registerGoogleForm = new FormGroup({
    website: new FormControl(''),
    functie: new FormControl('', [Validators.required]),
    bio: new FormControl(''),
    gdpr: new FormControl('', [Validators.required])
  });

  routeSub: any;
  position = 0;
  positionStyle = "";


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
    if (this.user) {
      if (this.id === 'livestream') {
        this.goToLivestream();
      } else {
        this.goToHome();
      }

    }
  }

  goToHome() {
    this.route.navigate(['/network']);
  }
  goToLivestream() {
    this.route.navigate(['/livestream']);
  }

  EmailPasswordRegister(formVal) {
    if (this.registerEmailForm.valid) {
      this.auth.EmailPasswordRegister(formVal, this.id, this.character).catch(error => {
        this.error = error.message;
      });
    }
  }

  GoogleRegister(formVal) {
    console.log(this.registerGoogleForm);
    if (this.registerGoogleForm.valid) {
      this.auth.googleSignUp(formVal, this.id, this.character);
    }
  }
  ngOnChanges() {
    if (this.auth.userId) {
      this.goToHome();
    }

  }

  setActiveCharacter(character) {
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
}
