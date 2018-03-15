import { Component,OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { User } from "./models/user.model";
import {socket} from "./provideSocket";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'app';
  user: User;
  constructor(private router: Router, private authService: AuthenticationService) {
    // console.log('over here');
    this.authService.checkValidLoggedIn();
  }

  ngOnInit(){
    var self = this;
    self.authService.loggedUser.subscribe((user:User)=>{
      self.user = user;
      if(self.user){
        console.log('user :', self.user);
        socket.on('ping'+self.user.email,function(email:string){
          console.log('Present Sir : ' , self.user.email);
          socket.emit('attendence' , email);
        });
      }
    });
    
  }
  
}
