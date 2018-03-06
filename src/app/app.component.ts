import { Component,OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { User } from "./models/user.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'app';
  user: User;
  constructor(private router: Router, private authService: AuthenticationService) {
    this.router.navigateByUrl('/signin');
  }

  ngOnInit(){
    this.authService.loggedUser.subscribe((user:User)=>{
      this.user = user;
      console.log('user :', this.user);
    });
  }
  
}
