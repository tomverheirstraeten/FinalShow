import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  NotificationService
} from 'src/app/services/notification.service';
import {
  map
} from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() notif;
  liveStreamNotifications = [];
  chatroomNotifications = [];
  expoNotifications = [];
  faqNotifications = [];
  show = false;
  notifIds = [];
  notifSub: Subscription;
  constructor(private ns: NotificationService) {}

  ngOnInit() {
    this.getNotifications();
    const ids = localStorage.getItem('notificationId');
    if (ids === undefined || ids === null) {
      localStorage.setItem('notificationId', JSON.stringify(this.notifIds));
    } else {
      this.notifIds = JSON.parse(ids);
    }
  }
  ngOnDestroy(): void {

    if (this.notifSub !== undefined) {
      this.notifSub.unsubscribe();
    }
  }

  getNotifications() {
    this.notifSub = this.ns.getNotifiation().subscribe(res => {
      this.liveStreamNotifications = [];
      this.chatroomNotifications = [];
      this.expoNotifications = [];
      this.faqNotifications = [];
      res.forEach(notification => {
        if (notification['rooms']) {
          notification['rooms'].forEach(room => {
            if (this.notif === 'live stream') {
              if (room === 'live stream') {
                notification['show'] = true;
                if (this.notifIds.length) {
                  let idIsErIn = false;
                  this.notifIds.forEach(notifid => {
                    if (notifid === notification.id) {
                      idIsErIn = true;
                      return;
                    }
                  });
                  if(!idIsErIn){
                    this.liveStreamNotifications.push(notification);
                    this.makeNotificationDissapear(notification);
                  }

                } else {
                  this.liveStreamNotifications.push(notification);
                  this.makeNotificationDissapear(notification);
                }
              }
            }


            if (this.notif === 'chatrooms') {
              if (room === 'chatrooms') {
                notification['show'] = true;
                if (this.notifIds.length) {
                  let idIsErIn = false;
                  this.notifIds.forEach(notifid => {
                    if (notifid === notification.id) {
                      idIsErIn = true;
                      return;
                    }
                  });
                  if (!idIsErIn) {

                    this.chatroomNotifications.push(notification);
                    this.makeNotificationDissapear(notification);
                  }

                } else {
                  this.chatroomNotifications.push(notification);
                  this.makeNotificationDissapear(notification);
                }
              }
            }
            if (this.notif === 'expo') {
              if (room === 'expo') {
                notification['show'] = true;
                if (this.notifIds.length) {
                  let idIsErIn = false;
                  this.notifIds.forEach(notifid => {
                    if (notifid === notification.id) {
                      idIsErIn = true;
                      return;
                    }
                  });
                  if (!idIsErIn) {
                    this.expoNotifications.push(notification);
                    this.makeNotificationDissapear(notification);
                  }
                } else {
                  this.expoNotifications.push(notification);
                  this.makeNotificationDissapear(notification);
                }
              }
            }
            if (this.notif === 'faq') {
              if (room === 'faq') {
                notification['show'] = true;
                if (this.notifIds.length) {
                  let idIsErIn = false;
                  this.notifIds.forEach(notifid => {
                    if (notifid === notification.id) {
                      idIsErIn = true;
                      return;
                    }
                  });
                  if (!idIsErIn) {

                    this.faqNotifications.push(notification);
                    this.makeNotificationDissapear(notification);
                  }

                } else {
                  this.faqNotifications.push(notification);
                  this.makeNotificationDissapear(notification);
                }
              }
            }
          });
        }
      });

    })

  }
  makeNotificationDissapear(notification) {
    setTimeout(() => {
      if(notification.permanent){
        notification.show = true;
      }else{
        notification.show = false;
        this.notifIds.push(notification.id);
        localStorage.setItem('notificationId', JSON.stringify(this.notifIds));

      }



    }, 5000);
  }
}


