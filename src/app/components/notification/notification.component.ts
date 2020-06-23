import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  NotificationService
} from 'src/app/services/notification.service';
import {
  map
} from 'rxjs/operators';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() notif;
  liveStreamNotifications = [];
  chatroomNotifications = [];
  expoNotifications = [];
  faqNotifications = [];
  show = false;
  notifIds = []
  constructor(private ns: NotificationService) {}

  ngOnInit() {
    this.getNotifications();
    const ids = localStorage.getItem('notificationId');
    console.log(ids)
    if (ids === undefined || ids === null) {
      localStorage.setItem('notificationId', JSON.stringify(this.notifIds));
    } else {
      this.notifIds = JSON.parse(ids);
    }
  }

  getNotifications() {
    this.ns.getNotifiation().subscribe(res => {
      console.log(res);
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
                    console.log(idIsErIn);
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
                    console.log(idIsErIn);
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
                    console.log(idIsErIn);
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
                    console.log(idIsErIn);
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
      console.log("chat:", this.chatroomNotifications);
      console.log("expo:", this.expoNotifications);
      console.log("faq:", this.faqNotifications);
      console.log("stream:", this.liveStreamNotifications);
    });

  }
  makeNotificationDissapear(notification) {
    setTimeout(() => {
      notification.show = false;
      console.log('event')
      console.log(notification);
      if(!notification.permanent){
        this.notifIds.push(notification.id);
        localStorage.setItem('notificationId', JSON.stringify(this.notifIds));
      }


    }, 5000);
  }
}


