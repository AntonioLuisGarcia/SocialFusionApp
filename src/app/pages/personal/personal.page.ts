/// Angular
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

/// Services
import { AuthService } from 'src/app/core/services/auth.service';
import { LikeService } from 'src/app/core/services/like.service';
import { PostService } from 'src/app/core/services/post.service';
import { CommentService } from 'src/app/core/services/comment.service';

/// Interfaces
import { Comment } from 'src/app/core/interfaces/Comment';
import { PostExtended } from 'src/app/core/interfaces/post';
import { UserExtended } from 'src/app/core/interfaces/User';

/// Modal
import { CommentModalComponent } from '../home/comment-modal/comment-modal.component';
import { AddPostModalComponent } from 'src/app/shared/components/add-post-modal/add-post-modal.component';
import { ConfirmDeleteAccountComponent } from './confirm-delete-account/confirm-delete-account.component';
import { Router } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { dataURLtoBlob } from 'src/app/core/helpers/blob';
import { MediaService } from 'src/app/core/services/media.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.page.html',
  styleUrls: ['./personal.page.scss'],
})
export class PersonalPage implements OnInit {

  userPosts: PostExtended[] | any;
  actualUser: UserExtended | any;

  constructor(
    private authService:AuthService,
    private postService:PostService,
    private likeService:LikeService,
    private mediaService: MediaService,
    private commentService:CommentService,
    private modalController:ModalController,
    private router:Router,
  ) { }

  ngOnInit() {
    this.authService.me().subscribe( data => {
      this.actualUser = data
      this.postService.getPostsByUserId(data.id).subscribe(data =>{
        this.userPosts = data
      })
    })
  }

  onLikePost(postId:number){

    this.authService.me().subscribe((data) =>{
      this.likeService.onLike(postId, data.id).subscribe({
        next: (response) => {
          this.postService.updatePostLike(postId,response.like)
          //this.postService.fetchAndEmitPosts(this.me.id)
        },
        error: (error) => {
          console.error('Error al cambiar el estado del like', error);
        }
      });
    })
  }
  
  onCommentPost(comment:Comment){
    this.authService.me().subscribe((data) =>{
        comment.userId = data.id
        this.commentService.addComment(comment).subscribe()  
    })    
  }
  
  async onShowComments(postId: number) {
    this.commentService.getCommentForPots(postId).subscribe(async (comments) => {
      const modal = await this.modalController.create({
        component: CommentModalComponent,
        componentProps: {
          'postId': postId,
          'comments': comments // Pasamos los comentarios como propiedad al modal
        }
      });
      await modal.present();
    });
  }
  
  
  onEditPost(post: PostExtended) {
    console.log(post);
    this.openEditModal(post);
  }
  
  onDeletePost(postId: number) {
    this.postService.deletePost(postId).subscribe( () =>
      this.loadPosts()
    )
  }

  loadPosts(){
    this.authService.me().subscribe( data => {
      this.postService.getPostsByUserId(data.id).subscribe(data =>{
        this.userPosts = data
      })
    })
  }

  async openEditModal(post: PostExtended) {
    const modal = await this.modalController.create({
      component: AddPostModalComponent,
      componentProps: {
        existingPost: post
      }
    });
    await modal.present();  
    const { data } = await modal.onDidDismiss();
    if (data && data.status === 'ok') {
      console.log(data);
      this.postService.updatePost(data.post).subscribe( ()=>
        this.loadPosts()
      );
    }
  }
  
  /*
  async editProfile(){
    const modal = await this.modalController.create({
      component: EditProfileComponent,
      componentProps: {
        user: this.actualUser
      }
    });
  
    console.log(this.actualUser)
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
    if (data && data.status === 'ok') {
      // Aquí manejas la lógica para actualizar el perfil del usuario
      console.log('Datos actualizados del perfil:', data.user);
      dataURLtoBlob(data.user.img, (blob:Blob)=>{
        this.mediaService.upload(blob).subscribe((media:number[])=>{
                // Obtener detalles del usuario
      this.authService.me().subscribe(
        user => {
          const imageUrl = media.length > 0 ? media[0] : null;
          console.log(imageUrl)
          const userInfo: any = {
            img: imageUrl,
            name: data.user.name,
            username: data.user.username
          };
        this.authService.updateUser(user.id, userInfo).subscribe({
          next: () => {
            //this.postService.fetchAndEmitPosts(this.me.id);
          },
          error: (error) => {
            console.error('Error al crear el post', error);
          }
        });
      });
        })
      })
    }
  }
*/

async editProfile() {
  const modal = await this.modalController.create({
    component: EditProfileComponent,
    componentProps: {
      user: this.actualUser
    }
  });

  console.log(this.actualUser);

  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data && data.status === 'ok') {
    console.log('Datos actualizados del perfil:', data.user);

    // Verifica si hay una imagen nueva o si la imagen se ha eliminado
    if (data.user.img && data.user.img !== this.actualUser.img) {
      // Si hay una imagen nueva y es diferente a la actual
      dataURLtoBlob(data.user.img, (blob: Blob) => {
        this.mediaService.upload(blob).subscribe((media: number[]) => {
          // Obtener detalles del usuario
          this.authService.me().subscribe(user => {
            const imageUrl = media.length > 0 ? media[0] : null;
            console.log('Nueva URL de imagen:', imageUrl);
            const userInfo: any = {
              image: imageUrl,
              name: data.user.name,
              username: data.user.username
            };
            // Actualiza la información del usuario con la nueva imagen
            this.updateUserProfile(user.id, userInfo);
          });
        });
      });
    } else if (!data.user.img) {
      // Si la imagen ha sido eliminada
      const userInfo: any = {
        image: null, // Establece la imagen en null para eliminarla
        name: data.user.name,
        username: data.user.username
      };
      // Actualiza la información del usuario sin la imagen
      this.updateUserProfile(this.actualUser.id, userInfo);
    } else {
      // Si la imagen no ha cambiado
      const userInfo: any = {
        name: data.user.name,
        username: data.user.username
      };
      // Actualiza solo el nombre y el nombre de usuario
      this.updateUserProfile(this.actualUser.id, userInfo);
    }
  }
}

updateUserProfile(userId: number, userInfo: any) {
  this.authService.updateUser(userId, userInfo).subscribe({
    next: () => {
      // Manejo adecuado tras la actualización exitosa
      console.log('Perfil actualizado correctamente.');
    },
    error: (error) => {
      console.error('Error al actualizar el perfil', error);
    }
  });
}


  async deleteAccount(){
    const modal = await this.modalController.create({
      component: ConfirmDeleteAccountComponent
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data && data.confirm) {

      this.authService.me().subscribe( data =>{
        this.authService.deleteUser(data.id).subscribe({
          next: (response) => {
            console.log('Cuenta eliminada correctamente.');
            this.router.navigate(['/login'])
          },
          error: (error) => {
            // Manejo de errores
            console.error('error al eliminar la cuenta', error);
          }
        });
      })
      
    }else{
      console.log("No")
    }
  }


}