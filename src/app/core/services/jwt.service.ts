import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): String {
    return window.sessionStorage['jwtToken'];
  }

  getId(): Number {
    return window.sessionStorage['id'];
  }

  saveToken(token: String) {
    window.sessionStorage['jwtToken'] = token;
  }

  saveId(id: Number) {
    window.sessionStorage['id'] = id;
  }

  destroyToken() {
    window.sessionStorage.removeItem('jwtToken');
    window.sessionStorage.removeItem('id');
  }

}
