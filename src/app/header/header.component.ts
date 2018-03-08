import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { AuthenticationService } from "../authentication.service";
import { User } from "../models/user.model";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @ViewChild('btnMob') btnMob: ElementRef;
  user: User;
  online:Boolean = true;
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
  closeMobileMenu(){
    if(document.body.clientWidth < 992){
      console.log('in closeMobileMenu');
      let el: HTMLElement = this.btnMob.nativeElement as HTMLElement;
      console.log(document.body.clientWidth);
      el.click();
    }
  }

  // toggleOnline(){
  //   this.online = !this.online;
  // }
}