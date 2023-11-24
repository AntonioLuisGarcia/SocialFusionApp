import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserExtended } from 'src/app/core/interfaces/User';
import { CommentEvent } from 'src/app/core/interfaces/comment';
import { PostExtended } from 'src/app/core/interfaces/post';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent  implements OnInit {

  @Input() post:PostExtended | null = null; //Uso el PostExtended para tener el id y poder usarlo en los eventos
  @Input() user:UserExtended | null = null; //Puedo usar solo user porque el username no se puede repetir, y con eso ya podria buscarlo

  @Output() onLikePost: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCommentPost: EventEmitter<CommentEvent> = new EventEmitter<CommentEvent>();
  @Output() onViewComments: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  //Si pulsan el like lanzamos el evento al padre
  like(event:any){
    if (this.post && this.post.id){
      console.log("LLega")
      this.onLikePost.emit(this.post?.id)
    }  
    event.stopPropagation();
  }

  //Si quieren ver los comentarios, debemos abrir el modal
  viewComments(event:any) {
    if (this.post && this.post.id) { //Comprobamos que existen
      this.onViewComments.emit(this.post.id);
    }
    event.stopPropagation();
  }
  
  //Si comentamos lanzamos el evento al padre
  comment(event:any, comment:string){
    if(this.post && this.post.id){
      this.onCommentPost.emit({
        postId: (this.post.id),
        userId:(this.user?.id),
        comment:(comment)
      })
    }
    event.stopPropagation();
  }
}
