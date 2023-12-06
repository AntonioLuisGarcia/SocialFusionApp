/// Angular
import { Injectable } from '@angular/core';

/// Rxjs
import { BehaviorSubject, Observable, concatMap, map, of} from 'rxjs';

/// Services
import { ApiService } from '../api.service';

/// Interfaces
import { Post, PostExtended } from '../../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private api:ApiService,
    ) { }

  
  private _posts:BehaviorSubject<PostExtended[]> = new BehaviorSubject<PostExtended[]>([]);
  public posts$:Observable<PostExtended[]> = this._posts.asObservable();


  public fetchAndEmitPosts(id:number): void {
    this.getPostsForUser(id).subscribe(posts => {
      this._posts.next(posts);
    });
  }

  public getPostById(id: number): Observable<any> {
    return this.api.get(`/posts/${id}?populate=user,likes.user`).pipe(
      map(response => {
        const item = response.data;
        // Ahora transforma los datos de acuerdo con tu estructura esperada
        return {
          id: item.id,
          description: item.attributes.description,
          img: item.attributes.image?.data?.attributes.url, // Si esperas una imagen, asegúrate de que este camino sea correcto
          date: item.attributes.createdAt,
          user: item.attributes.user.data ? {
            id: item.attributes.user.data.id,
            username: item.attributes.user.data.attributes.username,
            name: item.attributes.user.data.attributes.name,
            // Incluye aquí cualquier otro campo que necesites del usuario
          } : null,
          // Si necesitas información sobre los likes, deberías transformarlos aquí también
        };
      })
    );
  }

  public getAllPost(): Observable<PostExtended[]> {
    return this.api.get("/posts").pipe(
      map(response => {
        const posts = response.data.map((item: any) => {
          return {
            id: item.id,
            description: item.attributes.description,
            img: item.attributes.img,
            date: item.attributes.createdAt, 
            user: item.attributes.user
          };
        });
  
        // Actualizamos el BehaviorSubject con los nuevos posts
        this._posts.next(posts);
  
        // Devolvemos los posts como un observable
        return posts;
      })
    );
  }
  
  public getAllPostsWithUser(): Observable<PostExtended[]> {
    return this.api.get("/posts?populate=user").pipe(
      map(response => {
        const posts = response.data.map((item: any) => {
          return {
            id: item.id,
            description: item.attributes.description,
            img: item.attributes.image?.data?.attributes.url,
            date: item.attributes.createdAt,
            user: {
              id: item.attributes.user.data.id,
              username: item.attributes.user.data.attributes.username,
              name: item.attributes.user.data.attributes.name
            }
          };
        });
  
        // Actualizamos el BehaviorSubject con los nuevos posts
        this._posts.next(posts);
  
        // Devolvemos los posts como un observable
        return posts;
      })
    );
  }

  public getPostsByUserId(actualUserId: number, filterUserId: number): Observable<PostExtended[]> {
    return this.api.get(`/posts?populate[0]=user&populate[1]=likes.user&populate[2]=image&filters[user]=${filterUserId}`).pipe(
      map(response => {
        const posts = response.data.map((item: any) => {
          const hasImage = item.attributes.image?.data 
                            && item.attributes.image.data.attributes.formats 
                            && item.attributes.image.data.attributes.formats.medium;
          const imgURL = hasImage ? item.attributes.image.data.attributes.formats.medium.url : null;
  
          // Verifica si el usuario actual (actualUserId) ha dado "me gusta" al post
          const likedByUser = item.attributes.likes.data.some((like: any) => 
            like.attributes.user.data.id === actualUserId && like.attributes.like);
  
          return {
            id: item.id,
            description: item.attributes.description,
            img: imgURL,
            date: item.attributes.createdAt,
            user: {
              id: item.attributes.user.data.id,
              username: item.attributes.user.data.attributes.username,
              name: item.attributes.user.data.attributes.name
            },
            likedByUser: likedByUser // Esto será true si el usuario actual ha dado "me gusta" al post
          };
        });
  
        // Actualizamos el BehaviorSubject con los nuevos posts
        this._posts.next(posts);
  
        // Devolvemos los posts como un observable
        return posts;
      })
    );
  }
  

  public updatePost(post: any, userId: number): Observable<PostExtended> {
    const data = {
      data: {
        description: post.description,
        image: post.img
      }};
    return this.api.put(`/posts/${post.id}`, data).pipe(
      map((response: any) => {
        let updatedPost = response.data;
        // Asegurarse de que updatedPost tenga la información del usuario
        if (!updatedPost.user) {
          updatedPost = {
            ...updatedPost,
            user: { id: userId } // Añadiendo solo el ID del usuario
          };}
        // Actualizar la lista de posts con el post actualizado
        const posts = this._posts.value.map(p => p.id === post.id ? updatedPost : p);
        this._posts.next(posts); 
        return updatedPost;
      })
    );
  }
  
  public patchPost(post: PostExtended): Observable<PostExtended> {
    return this.api.patch(`/posts/${post.id}`, post).pipe(
      map((updatedPost: PostExtended) => {
        // Actualizamos la lista de posts con el post actualizado
        const posts = this._posts.value.map(p => p.id === post.id ? updatedPost : p);
        this._posts.next(posts);
  
        return updatedPost;
      })
    );
  }
  

  public postPost(post: Post): Observable<PostExtended> {
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
        return of(newPost);
      })
    );
  }

  public deletePost(postId:number):Observable<any>{
    return this.api.delete(`/posts/${postId}`).pipe(
      map(() => {
        const updatedPosts = this._posts.value.filter(post => post.id !== postId);
        this._posts.next(updatedPosts);
      })
    );
  }

  public getPostsForUser(userId: number): Observable<PostExtended[]> {
    const url = `/posts?populate[0]=user&populate[1]=likes.user&populate[2]=image`;
    return this.api.get(url).pipe(
      map(response => {
        const posts = response.data.map((item: any) => {
          const hasImage = item.attributes.image?.data 
                            && item.attributes.image.data.attributes.formats 
                            && item.attributes.image.data.attributes.formats.medium;
          const imgURL = hasImage ? item.attributes.image.data.attributes.formats.medium.url : null;
  
          const likedByUser = item.attributes.likes.data.some((like: any) => 
            like.attributes.user.data.id === userId && like.attributes.like);
  
          return {
            id: item.id,
            description: item.attributes.description,
            img: imgURL,
            date: item.attributes.createdAt,
            user: {
              id: item.attributes.user.data.id,
              username: item.attributes.user.data.attributes.username,
              name: item.attributes.user.data.attributes.name
            },
            likedByUser: likedByUser // Esto será true si el usuario actual ha dado "me gusta" al post
          };
        });
  
        // Actualizamos el BehaviorSubject con los nuevos posts
        this._posts.next(posts);
        return posts;
      })
    );
  }
  
  
  updatePostLike(postId: number, liked: boolean): void {
    // Primero, obtenemos el valor actual del Observable _posts.
    const currentPosts = this._posts.value;
  
    // Luego, creamos una nueva lista de posts, donde el post con el id especificado
    // tiene su propiedad 'likedByUser' actualizada.
    const updatedPosts = currentPosts.map(post =>
      post.id === postId ? { ...post, likedByUser: liked } : post
    );
  
    // Finalmente, emitimos la nueva lista de posts en el Observable _posts.
    this._posts.next(updatedPosts);
  }
}