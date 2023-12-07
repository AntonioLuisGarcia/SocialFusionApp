/// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

/// Services
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/strapi/post.service';
import { LikeService } from 'src/app/core/services/strapi/like.service';
import { CommentService } from 'src/app/core/services/strapi/comment.service';
import { MediaService } from 'src/app/core/services/media.service';

/// Interfaces
import { PostExtended } from 'src/app/core/interfaces/post';
import { UserExtended } from 'src/app/core/interfaces/User';
import { Comment } from 'src/app/core/interfaces/Comment';

/// Modals
import { AddPostModalComponent } from '../../shared/components/add-post-modal/add-post-modal.component';
import { CommentModalComponent } from '../../shared/components/comment-modal/comment-modal.component';

/// Helpers
import { dataURLtoBlob } from 'src/app/core/helpers/blob';

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
    private commentService:CommentService,
    private mediaService: MediaService,
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
      console.log(data.id)
      console.log(this.me.id)
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
  
  onCommentPost(comment:Comment){
    this.auth.me().subscribe((data) =>{
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
  
  async presentAddPostModal() {
    const modal = await this.modalController.create({
      component: AddPostModalComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && data.status === 'ok') {
      dataURLtoBlob(data.post.image, (blob:Blob)=>{
        this.mediaService.upload(blob).subscribe((media:number[])=>{
                // Obtener detalles del usuario
      this.auth.me().subscribe(
        user => {
          const imageUrl = media.length > 0 ? media[0] : null;
          console.log(imageUrl)
          const newPost: any = {
            img: imageUrl,
            description: data.post.description,
            userId: user.id
          };
        this.postService.postPost(newPost).subscribe({
          next: () => {
            this.postService.fetchAndEmitPosts(this.me.id);
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

}
