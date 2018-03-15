import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";
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
  
  constructor(private authService: AuthenticationService,private router: Router) { }

  ngOnInit() {
    this.authService.loggedUser.subscribe((user:User)=>{
      this.user = user;
    });
  }

  signout(){
    var self = this;
    self.authService.signout().subscribe(
      data=>{
        self.authService.clearToken();
        self.router.navigateByUrl('/signin');
        self.authService.loggedUser.emit(undefined);
        
      }
    )

  }
  closeMobileMenu(){
    if(document.body.clientWidth < 992){
      let el: HTMLElement = this.btnMob.nativeElement as HTMLElement;
      el.click();
    }
  }

  // toggleOnline(){
  //   this.online = !this.online;
  // }
}
