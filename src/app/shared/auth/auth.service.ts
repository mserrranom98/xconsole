import { Injectable } from '@angular/core';
import { VARGLOBAL } from '../../services/login-pass.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthService {
  token: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  signupUser(email: string, password: string) {
    // your code for signing up the new user
  }

  signinUser(email: string, password: string) {
    // your code for checking credentials and getting tokens for for signing in user
  }

  logout() {
    this.token = null;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    if (VARGLOBAL.userToken === '') {
      this.router.navigate(['/login'], { relativeTo: this.route.parent });
      return false;
    } else {
      return true;
    }
  }
}
