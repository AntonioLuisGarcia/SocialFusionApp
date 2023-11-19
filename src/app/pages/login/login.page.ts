import { Component, OnInit } from '@angular/core';
import { UserCredentials } from 'src/app/core/interfaces/UserCredentials';
import { UserRegister } from 'src/app/core/interfaces/UserRegister';
import { AuthStrapiService } from 'src/app/core/services/auth-strapi.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showLogin = true;

  constructor(
    private auth:AuthService,
  ) { }

  ngOnInit() {
  }

  onLogin(credentials:UserCredentials){
    this.auth.login(credentials).subscribe({
      next:data=>{
        
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  onRegister(credentials:UserRegister){
    this.auth.register(credentials).subscribe({
      next:data=>{
        
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  
  changeLogin(){
    this.showLogin = !this.showLogin;
  }

}
