import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map} from 'rxjs';
import { CommentExtended } from '../interfaces/Comment';



@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private api:ApiService,
  ) { 

  }

  getCommentForPots(postId:number):Observable<CommentExtended[]>{
      return this.api.get(`/comments?populate=*&filters[post]=${postId}`).pipe(map( 
        response => response.data.map( (comment:any) => {
          return {
            id: comment.id,
            text: comment.attributes.text,
            postId: comment.attributes.post.data.id,
            userId: comment.attributes.user.data.id,
          }
        })
      ));
  }

}
