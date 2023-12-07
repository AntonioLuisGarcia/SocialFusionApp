/// Angular
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

/// Services
import { AuthService } from 'src/app/core/services/auth.service';
import { LikeService } from 'src/app/core/services/strapi/like.service';
import { PostService } from 'src/app/core/services/strapi/post.service';
import { CommentService } from 'src/app/core/services/strapi/comment.service';
import { MediaService } from 'src/app/core/services/media.service';

/// Interfaces
import { Comment } from 'src/app/core/interfaces/Comment';
import { PostExtended } from 'src/app/core/interfaces/post';
import { UserExtended } from 'src/app/core/interfaces/User';

/// Modal
import { CommentModalComponent } from '../../shared/components/comment-modal/comment-modal.component';
import { AddPostModalComponent } from 'src/app/shared/components/add-post-modal/add-post-modal.component';
import { ConfirmDeleteAccountComponent } from './confirm-delete-account/confirm-delete-account.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

/// Helpers
import { dataURLtoBlob } from 'src/app/core/helpers/blob';
import { switchMap } from 'rxjs';

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
    this.authService.currentUser$.subscribe(user => {
      this.actualUser = user;
    });

    this.postService.posts$.subscribe(posts => {
      if (this.actualUser) {
        console.log(posts);
        this.userPosts = posts.filter((post: PostExtended) => post.user?.id === this.actualUser.id);
        this.userPosts.sort((a: PostExtended, b: PostExtended) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      }
    });
  }
  

  // PersonalPage Component
onLikePost(postId: number) {
  this.authService.me().subscribe((data) => {
    this.likeService.onLike(postId, data.id).subscribe({
      next: (response) => {
        // Encuentra el post en la lista para actualizarlo.
        const index = this.userPosts.findIndex((p: PostExtended) => p.id === postId);
        if (index !== -1) {
          // Cambia el estado de 'likedByUser' al opuesto del actual.
          const likedByUser = !this.userPosts[index].likedByUser;

          // Crea una nueva referencia del objeto post para la detección de cambios.
          const updatedPost = {
            ...this.userPosts[index],
            likedByUser: likedByUser,
          };

          // Crea una nueva referencia del arreglo para la detección de cambios.
          this.userPosts = [
            ...this.userPosts.slice(0, index),
            updatedPost,
            ...this.userPosts.slice(index + 1),
          ];
        }
      },
      error: (error) => {
        console.error('Error al cambiar el estado del like', error);
      }
    });
  });
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
    this.postService.deletePost(postId).subscribe( 
      //() =>
      //this.loadPosts()
    )
  }

  loadPosts(){
    this.authService.me().subscribe( data => {
      this.postService.getPostsByUserId(data.id, data.id).subscribe(data =>{
        this.userPosts = data
        console.log("scroll1")
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
      const { description, image } = data.post;
      const currentImage = post.img;
      dataURLtoBlob(image, (blob: Blob) => {
        this.mediaService.upload(blob).pipe(
          switchMap((media: number[]) => {
            const imageUrl = media.length > 0 ? media[0] : null;
            const updatedData = {
              ...post,
              description,
              img: imageUrl || currentImage
            };
            return this.postService.updatePost(updatedData, this.actualUser.id);
          }),
          switchMap(() => this.postService.getPostsByUserId(this.actualUser.id, this.actualUser.id))
        ).subscribe(updatedPosts => {
          this.userPosts = updatedPosts;
        });
      });
    }  
}

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
    next: (updatedUser: UserExtended) => {
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


  normalizePostData(apiResponse: any, currentUser: UserExtended, like:any): PostExtended {
    let post: PostExtended;

    if (apiResponse.attributes) {
      // Si la respuesta viene de Strapi y tiene un formato anidado
      post = {
        id: apiResponse.id,
        description: apiResponse.attributes.description,
        date: apiResponse.attributes.createdAt,
        img: apiResponse.attributes.image?.data?.attributes.url,
        user: {
          id: apiResponse.user?.id || currentUser.id,
          username: currentUser.username, // Usa el nombre de usuario del usuario actual
          name: currentUser.name,
        },
        likedByUser: like
      };
    } else {
      // Si la respuesta ya está en el formato plano esperado
      post = {
        ...apiResponse,
        user: apiResponse.user || {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name,
        },
        likedByUser: like // Mantén el estado del "like" si ya viene incluido
      };
    }
  
    return post;
  }
  
}