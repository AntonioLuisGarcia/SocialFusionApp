import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LikeService } from 'src/app/core/services/like.service';
import { PostService } from 'src/app/core/services/post.service';
import { Comment } from 'src/app/core/interfaces/Comment';
import { CommentService } from 'src/app/core/services/comment.service';
import { ModalController } from '@ionic/angular';
import { CommentModalComponent } from 'src/app/shared/components/comment-modal/comment-modal.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  user: any;
  posts: any;

  constructor(
    private postService:PostService,
    private authService:AuthService,
    private likeService: LikeService,
    private commentService: CommentService,
    private modalController:ModalController,
  ) { }

  ngOnInit() {
    this.user = history.state.user;
    this.authService.me().subscribe(
      data =>{
        this.postService.getPostsByUserId(data.id, this.user.id).subscribe(
          posts => {console.log(data)
            this.posts = posts
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

}
