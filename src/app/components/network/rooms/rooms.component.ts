import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

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
  getRooms(){
    this.cs.getRooms().subscribe((rooms) => {
      this.allRooms = rooms;

    });
  }


}
