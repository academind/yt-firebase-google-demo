import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Message } from './chat/message.model';

@Injectable()
export class FirebaseService {
  authChanged = new BehaviorSubject<firebase.User>(null);
  error = new BehaviorSubject<firebase.FirebaseError>(null);
  messagesUpdated = new Subject<{ content: string, userId: string }[]>();
  authenticatedUser: firebase.User;

  constructor (private router: Router) {}

  signUserIn(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
      (user: firebase.User) => {
        this.authChanged.next(user);
        this.authenticatedUser = user;
        this.router.navigate(['/']);
      }
      )
      .catch(
      (error: firebase.FirebaseError) => {
        this.error.next(error);
      }
      );
  }

  signUserUp(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(
      (user: firebase.User) => {
        this.authChanged.next(user);
        this.authenticatedUser = user;
        this.router.navigate(['/']);
      }
      )
      .catch(
      (error: firebase.FirebaseError) => {
        this.error.next(error);
      }
      );
  }

  logUserOut() {
    firebase.auth().signOut();
    this.authChanged.next(null);
    this.authenticatedUser = null;
  }

  listenToMessages() {
    firebase.database().ref('messages').on('value', (data: firebase.database.DataSnapshot) => {
      const messages: Message[] = [];
      data.forEach(element => {
        messages.push(element.val());
        return false;
      });
      console.log(messages);
      this.messagesUpdated.next(messages);
    });
  }

  sendMessage(message: string) {
    firebase.database().ref('messages').push({ content: message, userId: this.authenticatedUser.uid })
      .then(
      (result) => {
        console.log(result);
      }
      )
      .catch(
      (error: firebase.FirebaseError) => {
        console.log(error);
      }
      );
  }
}
