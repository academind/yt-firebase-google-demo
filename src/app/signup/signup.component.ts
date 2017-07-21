import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';

import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignup(formValue: {email: string, password: string}) {
    this.fbService.signUserUp(formValue.email, formValue.password);
  }

  ngOnDestroy() {
    this.fbErrorSubscription.unsubscribe();
  }
}
