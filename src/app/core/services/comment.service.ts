import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map} from 'rxjs';
import { Comment, CommentExtended, CommentWithUserName } from '../interfaces/Comment';



@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private api:ApiService,
  ) { 

  }

  getCommentForPots(postId:number):Observable<CommentWithUserName[]>{
      return this.api.get(`/comments?populate=*&filters[post]=${postId}`).pipe(map( 
        response => response.data.map( (comment:any) => {
          return {
            id: comment.id,
            text: comment.attributes.text,
            postId: comment.attributes.post.data.id,
            user: comment.attributes.user.data.attributes.username,
          }
        })
      ));
  }

  addComment(comment:Comment){
    const body = {
      data:{
        text: comment.text,
        post: comment.postId,
        user: comment.userId,
      }
    }
    return this.api.post(`/comments`,body)
  }
}
