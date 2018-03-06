import { Component, OnInit } from '@angular/core';
import { NgModel,NgForm } from '@angular/forms';
import { SignUp } from './signup.model';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {
  success: Boolean = false;
  error: Boolean = false;
  errorMessage: String;
  signup:SignUp = new SignUp('', '', '', '');
  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
  }
  
  onSubmit(signupForm: NgForm){
    this.success = this.error = false;
    this.errorMessage = '';
    console.log('in check');
    console.log(this.signup);
    var self = this;
    const user = this.signup;
    this.auth.signup(user)
        .subscribe(
            data =>{
                signupForm.reset();
                console.log('data: ', data);
                self.success = true;
            },
            error =>{ 
              console.error(error.error);
              self.error = true;
              if(error.error.message){
                self.errorMessage = error.error.message;
              }
            }
        );
  }

}
