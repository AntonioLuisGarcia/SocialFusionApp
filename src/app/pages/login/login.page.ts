import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showLogin = true;

  constructor() { }

  ngOnInit() {
  }

  onLogin($event: any) {
    
  }

  
  changeLogin(){
    this.showLogin = !this.showLogin;
  }

}
