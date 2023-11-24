import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Post, PostExtended } from 'src/app/core/interfaces/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';
import { AddPostModalComponent } from './add-post-modal/add-post-modal.component';
import { UserExtended } from 'src/app/core/interfaces/User';

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
    public modalController: ModalController,
    ) {}
  
  posts: PostExtended[] | any;
  me: UserExtended | any;
  
  
  ngOnInit() {
    // Suscribirse al observable para obtener los posts
    this.postService.getAllPostsWithUser().subscribe((data) => {
      this.posts = data;
    });

    this.auth.me().subscribe((data)=> this.me = data);
  }

  onLikePost(){
    // el servicio de post y like creara el registro de usuario y post
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
            // Manejar la respuesta
          },
          error: (error) => {
            console.error('Error al crear el post', error);
          }
        });
      });
    }
  }


}
