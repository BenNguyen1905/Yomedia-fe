import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(
      private http:HttpClient,
      private jwtHelper : JwtHelperService
    ) { }
  login(data: any): Observable<any> {
    return this.http.post( `${baseUrl}login`,data);
  }
  isLogedIn(){
    const data = JSON.parse(localStorage.getItem('key'));
    if(data && !this.jwtHelper.isTokenExpired(data.token)){
      return true;
    } else {
      return false;
    }
  }
  logout() {
    const data = JSON.parse(localStorage.getItem('key'));
    if(data){
      localStorage.clear();
    }
  }
}

