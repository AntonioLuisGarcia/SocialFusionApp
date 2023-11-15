import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItemComponent } from './post-item/post-item.component';
import { PostListComponent } from './post-list/post-list.component';


@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule,
  ],
  declarations: [
    HomePage,
    PostItemComponent,
    PostListComponent,
  ],
  exports:[
    HomePage,
    PostItemComponent,
    PostListComponent,
  ]
})
export class HomePageModule {}
