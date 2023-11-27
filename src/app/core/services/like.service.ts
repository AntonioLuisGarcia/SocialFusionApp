import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject, Observable, map, switchMap } from "rxjs";
import { Like } from "../interfaces/like";

@Injectable({
  providedIn: "root"
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
      data:{
        like: true,
        user: userId,
        post: postId,
      }
      };
    return this.api.post("/likes", likeData);
  }
  
  public changeLikeStatus(likeId: number, likeStatus: boolean): Observable<any> {
    const body = {
      data: {
        like: likeStatus
      }
    };
    return this.api.put(`/likes/${likeId}`, body);
  }
  
  public onLike(postId: number, userId: number): Observable<any> {
    // Intenta encontrar un registro de like existente
    return this.api.get(`/likes?filters[post]=${postId}&filters[user]=${userId}`).pipe(
      switchMap((likeRecord: any) => {
        if (likeRecord.data.length > 0) {
          // Si existe cambia su estado
          const newLikeStatus = !likeRecord.data[0].attributes.like;
          return this.changeLikeStatus(likeRecord.data[0].id, newLikeStatus);
        } else {
          // Si no existe, crea un nuevo registro de like
          return this.createLike(postId, userId);
        }
      })
    );
  }

  checkLike(postId: number, userId: number): Observable<boolean> {
    return this.api.get(`/likes?filters[post]=${postId}&filters[user]=${userId}`)
    .pipe(
      map(response => {
        // Primero, verifica si hay algún dato
        if (response.data && response.data.length > 0) {
          // Si hay datos, devuelve el valor de 'like'
          return response.data[0].attributes.like;
        }
        // Si no hay datos, entonces no hay 'like', devuelve false
        return false;
      })
    );
  }

}
