import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../authentication.service";
import { User } from "../models/user.model";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  user: User;
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.loggedUser.subscribe((user:User)=>{
      this.user = user;
      console.log('in header user :', this.user);
    });
  }

  signout(){
    this.authService.signout();
  }

}
