import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Like } from '../interfaces/like';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(
    private api:ApiService
  ) { 

  }

  private _posts:BehaviorSubject<Like[]> = new BehaviorSubject<Like[]>([]);
  public posts$:Observable<Like[]> = this._posts.asObservable();

  public createLike(postId: number, userId: number): Observable<any> {
    const likeData = {
      postId: postId,
      userId: userId,
      like: true
    };
    return this.api.post('/post-user-likes', likeData);
  }
  
  public changeLikeStatus(likeId: number, likeStatus: boolean): Observable<any> {
    return this.api.put(`/post-user-likes/${likeId}`, { like: likeStatus });
  }
  
  public onLike(postId: number, userId: number): Observable<any> {
    // Intenta encontrar un registro de like existente
    return this.api.get(`/post-user-likes/find?postId=${postId}&userId=${userId}`).pipe(
      switchMap((likeRecord: any) => {
        if (likeRecord) {
          // Si existe, cambia su estado
          const newLikeStatus = !likeRecord.like;
          return this.changeLikeStatus(likeRecord.id, newLikeStatus);
        } else {
          // Si no existe, crea un nuevo registro de like
          return this.createLike(postId, userId);
        }
      })
    );
  }

}
