import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { RoomsService } from 'src/app/services/rooms.service';

import { InteractionService } from 'src/app/services/interaction.service';
import * as p5 from 'p5';
import { ɵBROWSER_SANITIZATION_PROVIDERS } from '@angular/platform-browser';


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
  users = new Array();
  myX = 0;
  myY = 0;
  easing = .05;
  username: string;
  playing = false;
  speed = 30;
  database;
  myRole: string;
  roomDelay = 50; // the amount of frames you have to wait to enter a room

  circleMask;

  webImage;
  motionImage;
  mobileImage;
  digitalMakingImage;
  generalImage;


  constructor(public auth: AuthService, public cs: ChatService, public userService: UsersService, public route: Router, public interactionService: InteractionService, public roomsService: RoomsService) {
    this.database = interactionService.getDatabase();
  }

  ngOnInit() {
    // console.log(this.auth.userId);
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
      s.preload = () => { // load the images needed
        this.webImage = s.loadImage('assets/images/cluster-icons/web.svg');
        this.motionImage = s.loadImage('assets/images/cluster-icons/motion.svg');
        this.mobileImage = s.loadImage('assets/images/cluster-icons/mobile.svg');
        this.digitalMakingImage = s.loadImage('assets/images/cluster-icons/digitalMaking.svg');
        this.generalImage = s.loadImage('assets/images/cluster-icons/generalChat.svg');
      }

      s.setup = () => { // initial setup
        s.createCanvas(s.windowWidth, s.windowHeight);

        s.frameRate(20);
      };
      s.draw = () => { // updates every frame
        s.translate(-this.myX + s.width / 2, -this.myY + s.height / 2); // center your player

        s.background(255);
        s.stroke(0);
        s.rect(0, 0, s.width, s.height);

        if (this.playing) { // if all the conditions to start playing are met (e.g. logged in)
          // console.log(allUsers);

          let drawnUsers = []; // this makes sure we draw every user only once every frame
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < allUsers.length; i++) { // display all of the users
            if (allUsers[i] !== undefined) {
              s.stroke(s.color(0, 0, 255));
              if (this.username !== allUsers[i].name && !drawnUsers.includes(allUsers[i].name)) {
                if (allUsers[i].name !== 'undefined') {
                  // if it's not the current user & the user hasn't been drawn already
                  this.drawUser(s, allUsers[i].x, allUsers[i].y, allUsers[i].name, allUsers[i].role); // draw the user
                  drawnUsers.push(allUsers[i].name); // and add it to the list of users drawn this frame
                  // check if the current user is close
                  this.checkDistance(s, this.myX, this.myY, allUsers[i].x, allUsers[i].y, allUsers[i].name, 50);
                }
              }
            }
          }

          this.displayGroups(s);
          this.move(s); // move the current player
        }
      };

    };
    this.canvas = new p5(sketch);

    document.getElementById('defaultCanvas0').style.display = 'none'; // workaround so it doesn't display it twice..

  }

  move(sketch) {
    let x = sketch.mouseX;
    let y = sketch.mouseY;

    const speed = 5;

    // console.log('x: ' + x);
    // console.log('y: ' + y);
    // console.log(this.myX);

    let dirX = 0;
    let dirY = 0;

    if (x < sketch.width / 2 - 10) {
      dirX = -1;
    } else if (x > sketch.width / 2 + 10) {
      dirX = 1;
    }

    if (y < sketch.height / 2 - 10) {
      dirY = -1;
    } else if (y > sketch.height / 2 + 10) {
      dirY = 1;
    }

    // outer boundaries
    if (this.myY < 10) {
      this.myY = 10;
    } else if (this.myY > 1000) {
      this.myY = 1000;
    }

    if (this.myX < 10) {
      this.myX = 10;
    } else if (this.myX > 1000) {
      this.myX = 1000;
    }

    this.myX += speed * dirX;
    this.myY += speed * dirY;

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
        sketch.fill(149, 209, 123);
        break;
      default:
        sketch.fill(249, 212, 138);
    }

    sketch.rectMode('center');
    sketch.rect(x, y, userSize, userSize);
    sketch.fill(172, 182, 195);
    sketch.textSize(12);
    sketch.text(name, x, y + userSize);
    sketch.noFill();
  }

  displayGroups(sketch) {
    // web room
    this.displayGroup(sketch, 500, 450, 150, 'Web');
    // motion room
    this.displayGroup(sketch, 800, 700, 200, 'Motion');
    // alternate reality room
    this.displayGroup(sketch, 400, 100, 130, 'AR');
    // mobile room
    this.displayGroup(sketch, 200, 700, 170, 'Mobile');
    // experience room
    this.displayGroup(sketch, 50, 400, 250, 'Digital Making');
  }

  displayGroup(sketch, x, y, r, name) {
    // background
    sketch.noStroke();
    sketch.fill(249, 212, 138);
    sketch.circle(x, y, r);

    // text
    sketch.fill(0);
    sketch.textAlign('center');
    sketch.strokeWeight(0);
    sketch.textSize(20);
    sketch.text(name, x, y - r / 3);
    sketch.noFill();

    // image
    let image;
    switch (name) {
      case 'Web':
        image = this.webImage;
        break;
      case 'Motion':
        image = this.motionImage;
        break;
      case 'Mobile':
        image = this.mobileImage;
        break;
      case 'Digital Making':
        image = this.digitalMakingImage;
        break;
      default:
        image = this.generalImage;
        break;
    }

    sketch.imageMode('center');
    sketch.image(image, x, y, r / 3, r / 3);

    // check the distance
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
      if ((sketch.frameCount % this.roomDelay) === 0) {
        this.gotoRoom(action);
      }
    }
  }

  gotoRoom(room) {
    let roomName;
    switch (room) {
      case 'Motion':
        roomName = 'Motion';
        break;
      case 'Web':
        roomName = 'Web';
        break;
      case 'AR':
        roomName = 'Alternate Reality';
        break;
      case 'Mobile':
        roomName = 'Mobile Appliance';
        break;
      case 'Digital Making':
        roomName = 'Digital Making';
        break;
      default:
        roomName = 'General';
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
