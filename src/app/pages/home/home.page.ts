import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Post, PostExtended } from 'src/app/core/interfaces/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';
import { AddPostModalComponent } from './add-post-modal/add-post-modal.component';
import { UserExtended } from 'src/app/core/interfaces/User';
import { LikeService } from 'src/app/core/services/like.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  //llamo a los servicios 
  constructor(
    private auth:AuthService,
    private router:Router,
    private postService:PostService,
    private likeService:LikeService,
    public modalController: ModalController,

    ) {}
  
  posts: PostExtended[] | any;
  me: UserExtended | any;
  
  
  ngOnInit() {
    this.auth.me().subscribe((data) => {
      this.me = data;

      // Ahora que tenemos `this.me`, podemos obtener los posts
      if (this.me && this.me.id) {
        this.postService.posts$.subscribe((posts) => {
          this.posts = posts;
        });
        this.postService.fetchAndEmitPosts(data.id);
      }
    });
  }

  onLikePost(postId:number){

    this.auth.me().subscribe((data) =>{
      this.likeService.onLike(postId, data.id).subscribe({
        next: (response) => {
          this.postService.updatePostLike(postId,response.like)
          this.postService.fetchAndEmitPosts(this.me.id)
        },
        error: (error) => {
          console.error('Error al cambiar el estado del like', error);
        }
      });
    })
  }
  
  onCommentPost(){
    // el servicio creara la relacion de post y comments y añadira el id del usuario para saber a quien corresponde el comentario
  }
  
  onShowComments(){
    // aqui saltara el modal con todos los comentarios del post seleccionado por su id
  }

  onSignOut() {
    this.auth.logout().subscribe(_=>{
      this.router.navigate(['/login']);
    });  
  }

  async presentAddPostModal() {
    const modal = await this.modalController.create({
      component: AddPostModalComponent
    });
  
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
    if (data && data.status === 'ok') {
      // Obtener detalles del usuario
      this.auth.me().subscribe(
        user => {
        const newPost: Post = {
          img: data.post.img ? data.post.img : null, // verificar esto
          description: data.post.description,
          userId: user.id
        };
  
        // Hacemos el post de la nueva publicación
        this.postService.postPost(newPost).subscribe({
          next: (response) => {
            this.postService.fetchAndEmitPosts(this.me.id);
          },
          error: (error) => {
            console.error('Error al crear el post', error);
          }
        });
      });
    }
  }

}
