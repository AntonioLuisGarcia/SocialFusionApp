import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { PostExtended } from '../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private api:ApiService) { }

  
  private _posts:BehaviorSubject<PostExtended[]> = new BehaviorSubject<PostExtended[]>([]);
  public posts$:Observable<PostExtended[]> = this._posts.asObservable();

  public getAllPost(): Observable<PostExtended[]> {
    return this.api.get("/posts").pipe(
      map(response => response.data.map((item: any) => {
        return {
          id: item.id,
          description: item.attributes.description,
          img: item.attributes.img,
          date: item.attributes.createdAt, 
          user: item.attributes.user
        }
      }))
    );
  }

  public getPostsByUserId(userId: number): Observable<PostExtended[]> {
    return this.api.get(`/posts?filters[user][id]=${userId}`).pipe(
      map(response => response.data.map((item: any) => {
        return {
          id: item.id,
          userId: item.attributes.user.id,
          description: item.attributes.description,
          img: item.attributes.img,
          date: item.attributes.createdAt
        }
      }))
    );
  }

  public updatePost(post:PostExtended):Observable<PostExtended>{
    return this.api.put("post",post);//verificar
  }

  public patchPost(post:PostExtended):Observable<PostExtended>{
    return this.api.patch("post",post);//verificar
  }

  public postPost(post:PostExtended):Observable<PostExtended>{
    return this.api.post("post",post);//verificar
  }

  public deletePost(post:PostExtended):Observable<PostExtended>{
    return this.api.delete("post",post);//verificar
  }
}
