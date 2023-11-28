import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItemComponent } from './post-item/post-item.component';
import { PostListComponent } from './post-list/post-list.component';
import { AddPostModalComponent } from './add-post-modal/add-post-modal.component';
import { CommentItemComponent } from './comment-item/comment-item.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';


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
    CommentItemComponent,
    CommentModalComponent
  ],
  exports:[
    HomePage,
    PostItemComponent,
    PostListComponent,
    AddPostModalComponent,
    CommentItemComponent,
    CommentModalComponent
  ]
})
export class HomePageModule {}
