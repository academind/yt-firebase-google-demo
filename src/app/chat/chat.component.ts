import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { FirebaseService } from './../firebase.service';
import { Message } from './message.model';
import { User } from './../user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  fbAuthSubscription: Subscription;
  fbMessagesSubscription: Subscription;
  authenticated = false;
  user: User;
  messages: Message[];

  constructor(private fbService: FirebaseService) { }

  ngOnInit() {
    this.fbAuthSubscription = this.fbService.authChanged.subscribe(
      (user: firebase.User) => {
        if (user) {
          this.user = this.fbService.authenticatedUser;
          this.authenticated = true;
          this.fbService.listenToMessages();
        } else {
          this.authenticated = false;
        }
      }
    );
    this.fbMessagesSubscription = this.fbService.messagesUpdated.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    );
  }

  onSend(message: string) {
    this.fbService.sendMessage(message);
  }

  ngOnDestroy() {
    this.fbAuthSubscription.unsubscribe();
  }

}
