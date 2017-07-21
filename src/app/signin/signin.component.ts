import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {
  error: firebase.FirebaseError;
  fbErrorSubscription: Subscription;

  constructor(private fbService: FirebaseService) { }

  ngOnInit() {
    this.fbErrorSubscription = this.fbService.error.subscribe(
      (error: firebase.FirebaseError) => {
        this.error = error;
      }
    );
  }

  onSignin(formValue: { email: string, password: string }) {
    this.fbService.signUserIn(formValue.email, formValue.password);
  }

  ngOnDestroy() {
    this.fbErrorSubscription.unsubscribe();
  }
}
