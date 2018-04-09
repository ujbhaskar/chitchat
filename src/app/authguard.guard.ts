import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthguardGuard implements CanActivate{
    constructor(private auth: AuthenticationService, private router: Router){}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
            console.log('in canActivate where logged in is :' , this.auth.isLoggedIn());
            if(!this.auth.isLoggedIn()){
                this.router.navigateByUrl('/signin');
            }
            return this.auth.isLoggedIn();
    }
}