import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { LoginFormComponent } from './login-form/login-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    LoginPage,
    LoginFormComponent,
    CreateAccountFormComponent,
  ],exports:[
    LoginFormComponent,
  ]
})
export class LoginPageModule {}
