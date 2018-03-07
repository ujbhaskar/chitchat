import { Injectable,EventEmitter,OnInit } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import 'rxjs/Rx';
import { Observable } from "rxjs";

@Injectable()
export class LiveChatService {
  loggedUser = new EventEmitter<User>();
  url: any = 'http://localhost:3000/';
  headers:Headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http, private router: Router) {

  }

  searchUser(keyword:String){
    let searchQuery:any = {};
    let str = keyword.split(' ');    
    let isValid = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(str[0]);  
    if (isValid) {
        searchQuery.email = str[0];
    }
    else{
        searchQuery.firstName = str[0];
        if(str[1])
            searchQuery.lastName = str[1];
    }
    const body = JSON.stringify(searchQuery);
    // console.log('body: ' , body);    
    return this.http.post(this.url+'user/getUsers?token='+localStorage.getItem('token'),body, {headers: this.headers})
        .map((response: Response) =>response.json())
        .catch((error: Response) => {
            // this.errorsService.handleError(error.json());
            // this.clearToken();
            console.log('over here in searchUsers');
            // this.router.navigateByUrl('/signin');
            return Observable.throw(error.json());
        });
  }

}
