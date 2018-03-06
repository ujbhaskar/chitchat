import { Component, OnInit, Directive,ElementRef,Renderer } from '@angular/core';
import { NgModel,NgForm } from '@angular/forms';
import { SignIn } from './signin.model';
import { AuthenticationService } from '../authentication.service';
import { User } from "../models/user.model";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.less']
})
export class SigninComponent implements OnInit {
  auth:SignIn = new SignIn('', '');
  error:Boolean = false;
  errorMessage:String = '';

  constructor(private authService: AuthenticationService) { 
  }

  ngOnInit() {
    console.log('in ngOnInit'); 
    this.fetchLoggedUser();
  }
  fetchLoggedUser(){
    if(localStorage.getItem('token')){
      let self = this;
      this.authService.getUser()
        .subscribe(
            data =>{             
              this.authService.loggedUser.emit(data.obj);
              console.log('self.authService.loggedUser: ', self.authService.loggedUser);
            },
            error =>{ 
              console.error(error.error);
              localStorage.removeItem('token');
            }
        );
    }
  }
  onSubmit(signinForm: NgForm){
    console.log('in check');
    console.log(this.auth);
    this.error = false;
    this.errorMessage = '';
    var self = this;
    const user = this.auth;
    this.authService.signin(user)
        .subscribe(
            data =>{
              signinForm.reset();
              console.log('data: ', data);
              localStorage.setItem('token',data.token);
              this.fetchLoggedUser();
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
