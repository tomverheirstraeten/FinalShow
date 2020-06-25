import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnDestroy, OnChanges {
roomsSub: Subscription;
  userChats$;
  allRooms: any = [];
  constructor(public auth: AuthService, public cs: RoomsService, public userService: UsersService) {
    this.getRooms();
  }
  ngOnInit() {
    this.getRooms();
  }
  ngOnChanges() {

    this.getRooms();
  }
  ngOnDestroy() {

    if (this.roomsSub !== undefined) {
      this.roomsSub.unsubscribe();
    }
  }
  getRooms(){
    this.roomsSub = this.cs.getRooms().subscribe((rooms) => {
      this.allRooms = rooms;

    })
  }


}
