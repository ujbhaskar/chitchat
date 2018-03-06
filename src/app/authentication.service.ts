import { Injectable,EventEmitter,OnInit } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Router } from "@angular/router";
import { SignIn } from "./signin/signin.model";
import { SignUp } from "./signup/signup.model";
import { User } from "./models/user.model";
// import { ErrorService } from "../errors/errors.service";
// import {Configurations} from "../configurations/configurations.service";
import 'rxjs/Rx';
import { Observable } from "rxjs";
// import {ChatUser} from "../auth/chat-user.model";

@Injectable()
export class AuthenticationService {
  loggedUser = new EventEmitter<User>();
  url: any = 'http://localhost:3000/';
  headers:Headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http, private router: Router) {

  }

  signin(user: SignIn){
    const body = JSON.stringify(user);
    return this.http.post(this.url+'user/signin', body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
          console.log(error);
          return Observable.throw(error.json());
      });
  }
  signup(user: SignUp){
    const body = JSON.stringify(user);
    return this.http.post(this.url+'user', body, {headers: this.headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
          console.log(error);
          return Observable.throw(error.json());
      });
  }
  
  getUser(){
      const headers = new Headers({'Content-Type': 'application/json'});
      return this.http.get(this.url+'user/loggedUser?token='+localStorage.getItem('token'), {headers: headers})
          .map((response: Response) =>response.json())
          .catch((error: Response) => {
              // this.errorsService.handleError(error.json());
              this.clearToken();
              this.router.navigateByUrl('/signin');
              return Observable.throw(error.json());
          });
  }
  
    clearToken() {
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

    signout(){
        this.clearToken();
        this.loggedUser.emit(undefined);
        this.router.navigateByUrl('/signin');
    }

}
