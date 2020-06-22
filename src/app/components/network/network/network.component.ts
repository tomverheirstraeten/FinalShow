import { Component, OnInit, OnChanges } from '@angular/core';

import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { RoomsService } from 'src/app/services/rooms.service';

import { InteractionService } from 'src/app/services/interaction.service';
import * as p5 from 'p5';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  user;
  userChats$;
  myChats: any = [];
  allRooms: any = [];
  displayNameOtherUser = '';
  closer = true;

  canvas;
  ctx;
  users = new Array();
  myX = 0;
  myY = 0;
  easing = .05;
  username;
  playing = false;
  speed = 30;
  database;
  myRole;

  roomDelay = 50; // the amount of frames you have to wait to enter a room

  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService, public route: Router, public interactionService: InteractionService, public roomsService: RoomsService) {
    this.database = interactionService.getDatabase();
  }

  ngOnInit() {
    //     // console.log(this.auth.userId);
    this.checkIfUser();

    let allUsers = [{ x: -100, y: -100, name: 'test', role: 'student' }];

    this.database.ref('users').on('value', (snapshot) => {
      let count = 0;
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        this.database.ref('users/' + childKey).once('value', (dataSnapshot) => {
          const childData = dataSnapshot.val();
          allUsers[count] = { x: childData.x, y: childData.y, name: childKey, role: childData.role };
        });
        count++;
      });
    });

    this.roomsService.getRooms().subscribe((rooms) => {
      this.allRooms = rooms;
      // console.log(this.allRooms);
    });

    // start drawing the interaction room
    const sketch = s => {
      s.setup = () => { // initial setup
        s.createCanvas(s.windowWidth, s.windowHeight);
        s.frameRate(15);
      };
      s.draw = () => { // updates every frame
        s.translate(-this.myX + s.width / 2, -this.myY + s.height / 2);
        s.background(255);
        s.stroke(0);
        s.rect(0, 0, s.width, s.height);

        this.displayGroups(s);

        if (this.playing) { // if all the conditions to start playing are met (e.g. logged in)
          // console.log(allUsers);

          let drawnUsers = []; // this makes sure we draw every user only once every frame
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < allUsers.length; i++) { // display all of the users
            if (allUsers[i] !== undefined) {
              s.stroke(s.color(0, 0, 255));
              if (this.username !== allUsers[i].name && !drawnUsers.includes(allUsers[i].name)) {
                // if it's not the current user & the user hasn't been drawn already
                this.drawUser(s, allUsers[i].x, allUsers[i].y, allUsers[i].name, allUsers[i].role); // draw the user
                drawnUsers.push(allUsers[i].name); // and add it to the list of users drawn this frame
                // check if the current user is close
                this.checkDistance(s, this.myX, this.myY, allUsers[i].x, allUsers[i].y, allUsers[i].name, 50);
              }
            }
          }


          this.move(s); // move the current player
        }
      };

    };
    this.canvas = new p5(sketch);

    document.getElementById('defaultCanvas0').style.display = 'none'; // workaround so it doesn't display it twice..

  }

  move(sketch) {
    // code adapted from https://p5js.org/examples/input-easing.html
    // this code calculates the easing in/out
    // by always moving the user towards the mouse
    // but only a fraction (as defined by this.easing) of the distance
    const targetX = sketch.mouseX;
    const dx = targetX - this.myX;
    this.myX += dx * this.easing - 5;

    const targetY = sketch.mouseY;
    const dy = targetY - this.myY;
    this.myY += dy * this.easing + 5;

    // outer boundaries
    if (this.myY < -500) {
      this.myY = -500;
    } else if (this.myY > 1000) {
      this.myY = 1000;
    }

    if (this.myX < -500) {
      this.myX = -500;
    } else if (this.myX > 1000) {
      this.myX = 1000;
    }

    this.database.ref('users/' + this.username).set({
      x: this.myX,
      y: this.myY,
      role: this.myRole
    });

    this.drawUser(sketch, this.myX, this.myY, this.username, this.myRole);
  }

  drawUser(sketch, x, y, name, role) {
    const userSize = 50;
    sketch.strokeWeight(0);

    // decide the color based on the role of the user
    console.log(role);
    switch (role) {
      case 'student':
        sketch.fill(79, 205, 196);
        break;
      case 'docent':
        sketch.fill(243, 193, 193);
        break;
      case 'alumni':
        sketch.fill(255, 107, 107);
        break;
      case 'bedrijf':
        sketch.fill(	149, 209, 123);
        break;
      default:
        sketch.fill(249, 212, 138);
    }

    sketch.ellipseMode('center');
    sketch.ellipse(x, y, userSize, userSize);
    sketch.fill(0);
    sketch.textSize(12);
    sketch.text(name, x, y + userSize);
    sketch.noFill();
  }

  displayGroups(sketch) {
    // web room
    this.displayGroup(sketch, 500, 450, 150, 'Web Cluster');
    // motion room
    this.displayGroup(sketch, 800, 700, 200, 'Motion Cluster');
    // alternate reality room
    this.displayGroup(sketch, 400, 100, 130, 'AR Cluster');
    // mobile room
    this.displayGroup(sketch, 200, 700, 170, 'Mobile Cluster');
    // experience room
    this.displayGroup(sketch, 50, 400, 250, 'Experience Cluster')
  }

  displayGroup(sketch, x, y, r, name) {
    sketch.strokeWeight(3);
    sketch.stroke(249, 212, 138);
    sketch.noFill();
    sketch.circle(x, y, r);
    sketch.fill(0);
    sketch.textAlign('center');
    sketch.strokeWeight(0);
    sketch.textSize(20);
    sketch.text(name, x, y);
    sketch.noFill();
    this.checkDistance(sketch, this.myX, this.myY, x, y, name, r / 2);

    // to integrate with chat: check how many people are in this room
    // and display their color (as in the design)

  }

  checkDistance(sketch, x1, y1, x2, y2, action, radius) {
    let d = sketch.dist(x1, y1, x2, y2);
    if (d < radius) {
      // console.log(action);
      // this.playing = false;
      // to integrate with chat: place here redirect to chat based on the action
      if ((sketch.frameCount % this.roomDelay) == 0) {
        this.gotoRoom(action);
      }
    }
  }

  gotoRoom(room) {
    let roomName;
    switch (room) {
      case 'Motion Cluster':
        roomName = 'Motion';
        break;
      case 'Web Cluster':
        roomName = 'Web';
        break;
      default:
        roomName = 'Dance';
        break;
    }

    for (const kamer of this.allRooms) {
      if (kamer.roomName === roomName) {
        // console.log(roomName);
        if (kamer.id !== undefined) {
          window.location.href = '/room/' + kamer.id;
        }
      }
    }

  }


  async checkIfUser() {
    if (this.auth.userId) {
      this.user = await this.auth.user$;

      this.userService.getUsers().pipe(first()).subscribe(res => {
        for (const user of res) {
          if (user['uid'] == this.auth.userId) {
            this.username = user['displayName'];
            this.myRole = user['function'];
          }
        }
      });

      // console.log(this.username);
      this.playing = true;
    } else {
      this.goToLogin();

    }
  }

  goToLogin() {
    this.route.navigate(['/login']);
  }
  closeSearch() {
    this.closer = false;
    console.log('close');
  }
}
