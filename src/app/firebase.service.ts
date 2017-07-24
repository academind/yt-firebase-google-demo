import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Message } from './chat/message.model';
import { User } from './user.model';

@Injectable()
export class FirebaseService {
  authChanged = new BehaviorSubject<User>(null);
  error = new BehaviorSubject<firebase.FirebaseError>(null);
  messagesUpdated = new Subject<{ content: string, userId: string }[]>();
  authenticatedUser: User;

  constructor(private router: Router) { }

  signUserIn(email: string, password: string) {
    let fetchedUser: firebase.User;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
      (user: firebase.User) => {
        fetchedUser = user;
        return firebase.database().ref('users').child(user.uid).once('value');
      })
      .then((dataSnapshot: firebase.database.DataSnapshot) => {
        this.authenticatedUser = { id: fetchedUser.uid, imageUrl: dataSnapshot.val().imageUrl, isAdmin: dataSnapshot.val().isAdmin };
        this.authChanged.next(this.authenticatedUser);
        this.router.navigate(['/']);
      })
      .catch(
      (error: firebase.FirebaseError) => {
        this.error.next(error);
      });
  }

  signUserUp(email: string, password: string, file: File) {
    let createdUser: firebase.User;
    let imageUrl: string;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(
      (user: firebase.User) => {
        createdUser = user;
        return firebase.storage().ref(user.uid).put(file);
      })
      .then((uploadSnapshot: firebase.storage.UploadTaskSnapshot) => {
        imageUrl = uploadSnapshot.downloadURL;
        return firebase.database().ref('users').child(createdUser.uid).set({ imageUrl: uploadSnapshot.downloadURL, isAdmin: false });
      })
      .then(() => {
        this.authenticatedUser = {id: createdUser.uid, imageUrl: imageUrl, isAdmin: false};
        this.authChanged.next(this.authenticatedUser);
        console.log(this.authenticatedUser);
        this.router.navigate(['/']);
      })
      .catch(
      (error: firebase.FirebaseError) => {
        this.error.next(error);
      });
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
