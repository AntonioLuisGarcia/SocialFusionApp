/// Angular
import { Component, OnInit } from '@angular/core';

/// Service
import { AuthService } from 'src/app/core/services/auth.service';

/// Interfaces
import { UserCredentials } from 'src/app/core/interfaces/UserCredentials';
import { UserRegister } from 'src/app/core/interfaces/UserRegister';

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
