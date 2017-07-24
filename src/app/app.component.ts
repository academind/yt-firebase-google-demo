import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs/Subscription';

import { FirebaseService } from './firebase.service';
import { User } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  fbAuthSubscription: Subscription;
  authenticated = false;

  constructor(private fbService: FirebaseService) { }

  ngOnInit() {
    firebase.initializeApp({
      apiKey: 'AIzaSyDrDLZzjnDLYd7bLIBzdBqT9U219MBej8g',
      authDomain: 'fir-chat-75d32.firebaseapp.com',
      databaseURL: 'https://fir-chat-75d32.firebaseio.com',
      projectId: 'fir-chat-75d32',
      storageBucket: ''
    });

    this.fbAuthSubscription = this.fbService.authChanged.subscribe(
      (user: User) => {
        if (user) {
          this.authenticated = true;
        } else {
          this.authenticated = false;
        }
      }
    );
  }

  onLogout() {
    this.fbService.logUserOut();
  }

  ngOnDestroy() {
    this.fbAuthSubscription.unsubscribe();
  }
}
