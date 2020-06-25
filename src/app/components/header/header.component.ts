import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef
} from '@angular/core';
import {
  Location
} from '@angular/common';
import {
  Router
} from '@angular/router';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  Observable
} from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  randomCharacter;
  @Input() back: string;
  @Input() title: string;
  useragent = navigator.userAgent;
  user: Observable < any > ;
  constructor(private _location: Location, private router: Router, private auth: AuthService, private eRef: ElementRef) {}
  toggleInbox = true;
  ngOnInit(): void {
    this.getUser();

  }

  goBack() {
    this._location.back();
  }

  checkDevice = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(this.useragent)) {
      this.router.navigate(['/rooms']);
    } else if (/Chrome/i.test(this.useragent)) {
      this.router.navigate(['/desktopLanding']);
    } else {
      this.router.navigate(['/desktopLanding']);
    }
  }
  async getUser() {
    const user = await this.auth.getUser();
    if (user) {
      if(user.function === ''){
        this.goToGoogleRegister();
      }else{

        this.user = user;
      }
    } else {
      console.log('nouser');
    }
  }
  setRandom() {
    // tslint:disable-next-line: max-line-length
    const characters = ['character2', 'character3', 'character4', 'character5', 'character6', 'character7', 'character8', 'character9-f', 'character10-f', 'character11-f', 'character12-f', 'character13-f', 'character14-f', 'character15-f', 'character16-f', 'character17-f', 'character18-f', 'dino1', 'dino2', 'robot1', 'robot2', 'wetenschapper1', 'wetenschapper2', 'wetenschapper3-f', 'wetenschapper4-f', 'wetenschapper5-f', 'zwem1', 'zwem2', 'zwem3-f', 'zwem4-f', 'zwem5-f', 'zwem6-f', 'zwem7-f'];
    const randomNumber = Math.floor(Math.random() * length);
    this.randomCharacter = characters[randomNumber];
  }


  goToGoogleRegister() {
    this.router.navigate(['/google-register']);
  }

  @HostListener('document:click', ['$event'])
  clickout(event){
    if(!this.eRef.nativeElement.contains(event.target)){
      this.toggleInbox = true;
    } else if(this.toggleInbox == false && event.target.className != 'clickInbox'){
      this.toggleInbox = true;
    }
  }

}
