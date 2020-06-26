import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
// import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { NotificationService } from 'src/app/services/notification.service';
import { InteractionService } from 'src/app/services/interaction.service';
import * as p5 from 'p5';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit, OnDestroy {
  user;
  userChats$;
  myChats: any = [];
  allRooms: any = [];
  displayNameOtherUser = '';
  closer = true;
  room = 'chatrooms';

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
  myBio;
  myId;
  myCharacter;
  myAva;
  roomDelay = 50; // the amount of frames you have to wait to enter a room
  userSize = 50;

  circleMask;

  webImage;
  motionImage;
  mobileImage;
  digitalMakingImage;
  generalImage;
  vrImage;
  privateChatImage;

  userImages = [];

  userInfo: boolean;
  userInfoName: string;
  userInfoId: string;
  x;
  y;
  roomSubscribe;
  userSubscribe;

  constructor(public auth: AuthService,
    public userService: UsersService,
    public route: Router,
    public interactionService: InteractionService,
    public roomsService: RoomsService, ns: NotificationService) {
    this.database = interactionService.getDatabase();
  }

  ngOnDestroy() {
    this.canvas.remove();
    if (this.roomSubscribe !== undefined) {
      this.roomSubscribe.unsubscribe();
    }
    if (this.userSubscribe !== undefined) {
      this.userSubscribe.unsubscribe();
    }
    this.database.ref('users').off();
  }

  ngOnInit() {
    // console.log(this.auth.userId);
    this.checkIfUser();

    // template allUsers object
    let allUsers = [{ x: -100, y: -100, name: 'test', role: 'student', bio: '', id: '', character: '', image: Image }];

    // fill the allUsers object with information from the database
    this.database.ref('users').on('value', (snapshot) => {
      let count = 0;
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        this.database.ref('users/' + childKey).once('value', (dataSnapshot) => {
          const childData = dataSnapshot.val();
          // tslint:disable-next-line: max-line-length
          allUsers[count] = { x: childData.x, y: childData.y, name: childKey, role: childData.role, bio: childData.bio, id: childData.uid, character: childData.character, image: this.myAva };
        });
        count++;
      });
    });

    this.roomSubscribe = this.roomsService.getRooms().subscribe((rooms) => {
      this.allRooms = rooms;
      // console.log(this.allRooms);
    });

    // START OF THE SKETCH
    const sketch = s => {

      // PRELOAD
      s.preload = () => { // load the images needed
        this.webImage = s.loadImage('assets/images/cluster-icons/web.svg');
        this.motionImage = s.loadImage('assets/images/cluster-icons/motion.svg');
        this.mobileImage = s.loadImage('assets/images/cluster-icons/mobile.svg');
        this.digitalMakingImage = s.loadImage('assets/images/cluster-icons/digitalMaking.svg');
        this.generalImage = s.loadImage('assets/images/cluster-icons/generalChat.svg');
        this.vrImage = s.loadImage('assets/images/cluster-icons/vr.svg');
        this.privateChatImage = s.loadImage('assets/images/chatIcon.svg');
      }

      // SETUP
      s.setup = () => { // initial setup
        s.createCanvas(window.innerWidth, window.innerHeight);

        s.frameRate(20);

        this.myAva = s.loadImage('assets/mannekes/' + this.myCharacter + '.png');
        for (let i = 0; i < allUsers.length; i++) {
          if (allUsers[i].character != undefined && allUsers[i].character != '') {
            this.userImages.push(s.loadImage('assets/mannekes/' + allUsers[i].character + '.png'));
          } else {
            this.userImages.push(this.myAva);
          }
        }
      };

      // DRAW
      s.draw = () => { // updates every frame
        s.translate(-this.myX + s.width / 2, -this.myY + s.height / 2); // center your player

        this.userInfo = false;
        this.userInfoName = '';
        this.userInfoId = '';

        s.background(255);
        s.stroke(0);
        s.rect(0, 0, s.width, s.height);

        if (this.playing) { // if all the conditions to start playing are met (e.g. logged in, search is closed)
          // console.log(allUsers);

          let drawnUsers = []; // this makes sure we draw every user only once every frame
          console.log(allUsers)
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < allUsers.length; i++) { // display all of the users
            if (allUsers[i] !== undefined) {

              s.stroke(s.color(0, 0, 255));
              if (this.username !== allUsers[i].name && !drawnUsers.includes(allUsers[i].name)) {
                if (allUsers[i].name !== 'undefined') {
                  // if it's not the current user & the user hasn't been drawn already, draw the user
                  // tslint:disable-next-line: max-line-length
                  this.drawUser(s, allUsers[i].x, allUsers[i].y, allUsers[i].name, allUsers[i].role, allUsers[i].character, this.userImages[i]);
                  drawnUsers.push(allUsers[i].name); // and add it to the list of users drawn this frame

                  const dist = s.dist(this.myX, this.myY, allUsers[i].x, allUsers[i].y);

                  if (dist < this.userSize * 2) {
                    this.userInfo = true;
                    this.userInfoName = allUsers[i].name;
                    this.userInfoId = allUsers[i].id;
                    this.showUserInfo(s, allUsers[i], this.userImages[i]);
                  }
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

    // delete the unwanted second canvas
    if (document.getElementById('defaultCanvas0') != null) {
      document.getElementById('defaultCanvas0').remove();
    }
  }


  // MOVE FUNCTION
  move(sketch) {

    const x = sketch.mouseX;
    const y = sketch.mouseY;

    if (y > 100 && this.closer) {
       // if the mouse is not on the header and the search isn't opened
      const speed = 7;

      // to know how to move the user,
      // we calculate the direction in x and y
      // based on the position of the mouse
      // and then multiply the direction with the speed

      // negative x is to the left, positive x to the right
      // negative y is to the top, positive y to the bottom

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
      if (this.myY < 0) {
        this.myY = 0;
      } else if (this.myY > 2000) {
        this.myY = 2000;
      }

      if (this.myX < 0) {
        this.myX = 0;
      } else if (this.myX > 2000) {
        this.myX = 2000;
      }

      this.myX += speed * dirX;
      this.myY += speed * dirY;

      // save the data of the current user to the realtime database
      this.database.ref('users/' + this.username).set({
        x: this.myX,
        y: this.myY,
        role: this.myRole,
        bio: this.myBio,
        id: this.myId,
        character: this.myCharacter
      });
    }

    this.drawUser(sketch, this.myX, this.myY, this.username, this.myRole, this.myCharacter, this.myAva);
  }

  drawUser(sketch, x, y, name, role, character, image) {
    // background square
    sketch.strokeWeight(0);
    this.getUserColor(sketch, role);
    sketch.rectMode('center');
    sketch.rect(x, y, this.userSize, this.userSize);

    // name
    sketch.fill(172, 182, 195);
    sketch.textSize(12);
    sketch.textAlign('center');
    sketch.text(name, x, y + this.userSize);

    // avatar image
    sketch.noFill();
    if (character !== undefined && character !== '' && image != undefined) {
      sketch.image(image, x, y, this.userSize - 10, this.userSize + 10);
    }
  }

  getUserColor(sketch, role: string) {
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
  }

  displayGroups(sketch) {
    // web room
    this.displayGroup(sketch, 1500, 900, 170, 'Web');
    // motion room
    this.displayGroup(sketch, 400, 1300, 180, 'Motion');
    // alternate reality room
    this.displayGroup(sketch, 1800, 1500, 150, 'AR');
    // mobile room
    this.displayGroup(sketch, 600, 700, 170, 'Mobile');
    // experience room
    this.displayGroup(sketch, 1000, 150, 220, 'Digital Making');
    // general room
    this.displayGroup(sketch, 200, 200, 250, 'General');
  }

  displayGroup(sketch, x: number, y: number, r: number, name: string) {
    // background
    sketch.noStroke();
    sketch.fill(255, 107, 107);
    sketch.circle(x, y, r);

    // text
    sketch.fill(0);
    sketch.textAlign('center');
    sketch.strokeWeight(0);
    sketch.textSize(25);
    sketch.text(name, x, y - r / 3.5);
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
      case 'AR':
        image = this.vrImage;
        break;
      case 'General':
        image = this.generalImage;
        break;
      default:
        image = this.generalImage;
        break;
    }

    sketch.imageMode('center');
    sketch.image(image, x, y, r / 3, r / 3);

    // check the distance
    this.checkDistance(sketch, this.myX, this.myY, x, y, name, r / 2);

  }

  checkDistance(sketch, x1: number, y1: number, x2: number, y2: number, action: string, radius: number) {
    let d = sketch.dist(x1, y1, x2, y2);
    if (d < radius) {
      if ((sketch.frameCount % this.roomDelay) === 0) {
        this.gotoRoom(action);
      }
    }
  }

  gotoRoom(room: string) {
    let roomName: string;
    switch (room) {
      case 'Motion':
        roomName = 'Interactive Motion';
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
      case 'General':
        roomName = 'General';
        break;
    }

    for (const kamer of this.allRooms) {
      if (kamer.roomName === roomName) {
        if (kamer.id !== undefined) {
          window.location.href = '/room/' + kamer.id;
        }
      }
    }

  }

  showUserInfo(sketch, user, image) {
    // background rectangle
    sketch.textAlign('center');
    this.getUserColor(sketch, user.role);
    sketch.rect(user.x, user.y, 170, 190);

    // name
    sketch.fill(0);
    sketch.textSize(15);
    sketch.text(user.name, user.x, user.y - 50);

    // role
    sketch.textSize(12);
    sketch.textAlign('left');
    sketch.textStyle('italic');
    sketch.text(user.role, user.x - 60, user.y - 30);

    // biography
    sketch.textStyle('normal');
    if (user.bio !== '' && user.bio !== undefined) {
      sketch.text(user.bio, user.x - 5, user.y + 40, 110, 120);
    }

    // avatar
    if (image != undefined && image != null && user.character != undefined && user.character != '') {
      sketch.image(image, user.x + 70, user.y - 80, this.userSize - 10, this.userSize + 10);
    }
  }


  async checkIfUser() {
    this.user = await this.auth.getUser();
    if (this.user) {
      this.userService.getUsers().pipe(first()).subscribe(res => {
        for (const user of res) {
          if (user['uid'] === this.auth.userId) {
            if (user['function'] === '') {
              this.goToLogin();
            } else {
              this.username = user['displayName'];
              this.myRole = user['function'];
              this.myBio = user['bio'];
              this.myId = user['uid'];
              this.myCharacter = user['character'];
            }
          }
        }
      });

      this.playing = true;
    } else {
      this.goToLogin();
    }
  }

  goToLogin() {
    this.route.navigate(['/login']);
  }
  closeSearch() {
    this.closer = !this.closer;
  }
}
