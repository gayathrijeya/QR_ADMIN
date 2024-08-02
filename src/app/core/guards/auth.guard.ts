import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';
import { LoginService } from 'src/app/account/Services/login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(
        private router: Router,
        private loginService: LoginService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let isLoggeIn = this.loginService.isLoggeIn()
        if (isLoggeIn) {
            return true
        } else {
            this.router.navigateByUrl('/auth/login');
            return false;

        }
    }
}
