import { NgModule } from '@angular/core';

import { PersonalPageRoutingModule } from './personal-routing.module';

import { PersonalPage } from './personal.page';
import { UserInfoComponent } from './user-info/user-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmDeleteAccountComponent } from './confirm-delete-account/confirm-delete-account.component';

@NgModule({
  imports: [
    SharedModule,
    PersonalPageRoutingModule
  ],
  declarations: [
    PersonalPage,
    UserInfoComponent,
    ConfirmDeleteAccountComponent
  ]
})
export class PersonalPageModule {}
