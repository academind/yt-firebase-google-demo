import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from './user.model';
import { Message } from './chat/message.model';

@Injectable()
export class FirebaseService {
  authChanged = new BehaviorSubject<User>(null);
  error = new BehaviorSubject<firebase.FirebaseError>(null);
  messagesUpdated = new Subject<{ content: string, userId: string }[]>();
  authenticatedUser: User;

  constructor(private router: Router) { }

  signUserIn(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
      (user: firebase.User) => {
        firebase.database().ref('users').child(user.uid).on('value', (data: firebase.database.DataSnapshot) => {
          const authUser: User = {
            id: user.uid,
            isAdmin: data.val().isAdmin
          };
          this.authChanged.next(authUser);
          this.authenticatedUser = authUser;
          this.router.navigate(['/']);
        });
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
        const newUser: User = {id: user.uid, isAdmin: false};
        this.authChanged.next(newUser);
        this.authenticatedUser = newUser;
        return firebase.database().ref('users').child(user.uid).set({
          isAdmin: false
        });
      }
      )
      .then(
      result => {
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

  sendMessage(message: string, adminOnly: boolean) {
    firebase.database().ref('messages').push({
      content: message,
      userId: this.authenticatedUser.id,
      date: (new Date()).toISOString(),
      adminOnly: adminOnly
    })
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
