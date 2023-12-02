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
    private commentService:CommentService,
    private modalController:ModalController,
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

}