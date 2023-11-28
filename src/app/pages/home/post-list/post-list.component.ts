import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from 'src/app/core/interfaces/Comment';
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
  @Output() commentPost = new EventEmitter<Comment>();

  constructor() { }

  ngOnInit() {}

  onLikePost(postId: number) {
    this.likePost.emit(postId);
  }

  onViewComments(postId: number) {
    this.viewComments.emit(postId);
  }

  onCommentPost(comment: Comment) {
    console.log("Comentario recibido en PostListComponent:", comment);
    this.commentPost.emit(comment); // paso directamente data
  }
}
