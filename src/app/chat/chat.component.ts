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
      (user: User) => {
        if (user) {
          this.user = this.fbService.authenticatedUser;
          this.authenticated = true;
          this.user = user;
          this.fbService.listenToMessages();
        } else {
          this.authenticated = false;
          this.user = null;
        }
      }
    );
    this.fbMessagesSubscription = this.fbService.messagesUpdated.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    );
  }

  getMessages() {
    if (!this.messages || this.messages.length === 0) {
      return;
    }
    return this.messages.filter((message: Message) => {
      if (message.adminOnly) {
        return this.user ? this.user.isAdmin : false;
      } else {
        return true;
      }
    });
  }

  onSend(message: string, adminOnly: boolean) {
    this.fbService.sendMessage(message, adminOnly);
  }

  ngOnDestroy() {
    this.fbAuthSubscription.unsubscribe();
  }

}
