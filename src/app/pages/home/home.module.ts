import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItemComponent } from './post-item/post-item.component';
import { PostListComponent } from './post-list/post-list.component';
import { AddPostModalComponent } from './add-post-modal/add-post-modal.component';


@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule,
  ],
  declarations: [
    HomePage,
    PostItemComponent,
    PostListComponent,
    AddPostModalComponent,
  ],
  exports:[
    HomePage,
    PostItemComponent,
    PostListComponent,
    AddPostModalComponent,
  ]
})
export class HomePageModule {}
