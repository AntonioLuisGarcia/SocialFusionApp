import { Component } from '@angular/core';
import { PostExtended } from 'src/app/core/interfaces/post';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  posts: PostExtended[] | any;

  onLikePost(){

  }

  onCommentPost(){

  }

  onShowComments(){

  }
}
