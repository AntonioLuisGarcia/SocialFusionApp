import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentEvent } from 'src/app/core/interfaces/comment';
import { PostExtended } from 'src/app/core/interfaces/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent  implements OnInit {

  @Input() posts: PostExtended[] = [];
  @Output() likePost = new EventEmitter<number>();
  @Output() viewComments = new EventEmitter<number>();
  @Output() commentPost = new EventEmitter<{ postId: number, userId:number, comment: string }>();
  data: { postId: number; userId: number; comment: string; } | any;

  constructor() { }

  ngOnInit() {}

  onLikePost(postId: number) {
    this.likePost.emit(postId);
  }

  onViewComments(postId: number) {
    this.viewComments.emit(postId);
  }

  onCommentPost(data: { postId: number, userId: number, comment: string }) {
    this.commentPost.emit(data); // paso directamente data
  }
}
