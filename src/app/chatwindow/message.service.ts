import { Injectable,EventEmitter,OnInit } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { Message } from "../models/message.model";
import 'rxjs/Rx';
import { Observable } from "rxjs";

@Injectable()
export class MessageService {
//   loggedUser = new EventEmitter<User>();
  url: any = 'http://localhost:3000/';
  headers:Headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http, private router: Router) {

  }
  
    saveMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.url+'message?token='+localStorage.getItem('token'), body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                // this.errorsService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
    getMessages(email:string){
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(this.url+'message?email='+email+'&token='+localStorage.getItem('token'), {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                // this.errorsService.handleError(error.json());
                return Observable.throw(error.json());
            });

    }

    getUnseenCounts(email:any){
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(this.url+'message/unseenMessages?token='+localStorage.getItem('token')+'&email='+email, {headers: headers})
            .map((response: Response) =>response.json())
            .catch((error: Response) => {
                // this.errorsService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

}
