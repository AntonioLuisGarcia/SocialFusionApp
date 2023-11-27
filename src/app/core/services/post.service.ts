import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, concatMap, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { Post, PostExtended } from '../interfaces/post';
import { LikeService } from './like.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private api:ApiService,
    private likeService:LikeService,
    ) { }

  
  private _posts:BehaviorSubject<PostExtended[]> = new BehaviorSubject<PostExtended[]>([]);
  public posts$:Observable<PostExtended[]> = this._posts.asObservable();


  public fetchAndEmitPosts(id:number): void {
    this.getPostsForUser(id).subscribe(posts => {
      this._posts.next(posts);
    });
  }

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

  

  public getAllPostsWithUser(): Observable<PostExtended[]> {
    return this.api.get("/posts?populate=user").pipe(
      map(response => response.data.map((item: any) => {
        return {
          id: item.id,
          description: item.attributes.description,
          img: item.attributes.image?.data?.attributes.url, // Asegúrate de que esto se ajuste a la estructura de tu API
          date: item.attributes.createdAt,
          user: {
            id: item.attributes.user.data.id,
            username: item.attributes.user.data.attributes.username,
            name: item.attributes.user.data.attributes.name
          }
        };
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

  public postPost(post:Post):Observable<PostExtended>{ //mirar si devuelve post o postextended
    const body = {
      data: { 
        description: post.description,
        image: post.img,
        user: post.userId
      }
    };
    return this.api.post("/posts", body).pipe(
      concatMap((newPost: PostExtended) => {
        // Primero, actualizamos la lista de posts
        const posts = this._posts.value;
        this._posts.next([...posts, newPost]);
  
        // Luego, devolvemos un observable que emite el nuevo post
        // Este observable no se completará hasta que los datos del nuevo post se hayan cargado
        return of(newPost);
      })
    );
  }

  /**
   *   public async postPost(post:Post):Promise<PostExtended>{ //mirar si devuelve post o postextended
    const body = {
      data: { 
        description: post.description,
        image: post.img,
        user: post.userId
      }
    };
  
    // Usamos await para esperar a que se complete la solicitud HTTP
    const newPost: PostExtended = await this.api.post("/posts", body).toPromise();
  
    // Actualizamos la lista de posts
    const posts = this._posts.value;
    this._posts.next([...posts, newPost]);
  
    // Devolvemos el nuevo post
    return newPost;
  }
   */

  public deletePost(post:PostExtended):Observable<PostExtended>{
    return this.api.delete("post",post);//verificar
  }

  /*getPostsForUser(userId: number): Observable<PostExtended[]> {
    // obtenemos todos los posts
    // nos devuelve un observable de una lista de posts
    return this.getAllPostsWithUser().pipe(
      // con el switchMap manejamos la respuesta anterior
      // recibe la lista de posts y la transforma en otro observable
      switchMap(posts => {
        // Mapeamos cada post en un observable que comprueba si el usuario ha dado like al post
        const postsWithLikes = posts.map((post: any) => 
          this.likeService.checkLike(post.id, userId).pipe(
            // Dentro del map transformamos el resultado de checkLike para añadir los datos de like
            map(like => ({ ...post, likedByUser: like }))
          )
        );
        // Usamos forkJoin para esperar a que todos los observables terminen
        // luego se emite un observable cuando los demas observables han acabado
        return forkJoin(postsWithLikes);
      })
    );
  }*/

  getPostsForUser(userId: number): Observable<PostExtended[]> {
    // Asumiendo que la URL obtiene posts con la información de likes y usuarios incluida
    const url = `/posts?populate=user,likes.user`;

    return this.api.get(url).pipe(
      map(response => response.data.map((item: any) => {
        // Verifica si el usuario actual ha dado "me gusta" al post
        const likedByUser = item.attributes.likes.data.some((like: any) => 
          like.attributes.user.data.id === userId && like.attributes.like);

        return {
          id: item.id,
          description: item.attributes.description,
          img: item.attributes.image?.data?.attributes.url,
          date: item.attributes.createdAt,
          user: {
            id: item.attributes.user.data.id,
            username: item.attributes.user.data.attributes.username,
            name: item.attributes.user.data.attributes.name
          },
          likedByUser: likedByUser // Esto será true si el usuario actual ha dado "me gusta" al post
        };
      }))
    );
  }
  
  updatePostLike(postId: number, liked: boolean): void {
    this._posts.next(
      this._posts.value.map(post =>
        post.id === postId ? { ...post, likedByUser: liked } : post
      )
    );
  }

}