import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { FirebaseService } from './../firebase.service';
import { Message } from './message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  fbAuthSubscription: Subscription;
  fbMessagesSubscription: Subscription;
  authenticated = false;
  messages: Message[];

  constructor(private fbService: FirebaseService) { }

  ngOnInit() {
    this.fbAuthSubscription = this.fbService.authChanged.subscribe(
      (user: firebase.User) => {
        if (user) {
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
