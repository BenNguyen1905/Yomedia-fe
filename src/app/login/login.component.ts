import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logInForm : FormGroup;
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.itItForm();
    this.checkLogIn();
  }
  checkLogIn(){
    if(this.authService.isLogedIn()){
      this.router.navigate(['product']);
    }
  }
  itItForm() {
    this.logInForm = new FormGroup({
      username: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    })
  }
  loginProcess() {
    if(this.logInForm.valid){
      this.authService.login(this.logInForm.value).subscribe(result => {
        if(result.token){
          localStorage.setItem('key', JSON.stringify({
            'token': result.token
          }));
          this.router.navigate(['product']);
        } else {
          alert("Wrong credenticals");
        }
      })
    }
  }

}
