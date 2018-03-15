import { Component, OnInit, Directive,ElementRef,Renderer } from '@angular/core';
import { NgModel,NgForm } from '@angular/forms';
import { SignIn } from './signin.model';
import { Router } from "@angular/router";
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

  constructor(private authService: AuthenticationService, private router: Router) { 
  }

  ngOnInit() {
    this.fetchLoggedUser();
  }
  fetchLoggedUser(){
    if(localStorage.getItem('token')){
      let self = this;
      this.authService.getUser()
        .subscribe(
            data =>{
              this.authService.selfUser = data.obj;
              this.authService.loggedUser.emit(data.obj);
              this.router.navigateByUrl('/live');
            },
            error =>{ 
              console.error(error.error);
              localStorage.removeItem('token');
            }
        );
    }
  }
  onSubmit(signinForm: NgForm){
    this.error = false;
    this.errorMessage = '';
    var self = this;
    const user = this.auth;
    this.authService.signin(user)
        .subscribe(
            data =>{
              signinForm.reset();
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
