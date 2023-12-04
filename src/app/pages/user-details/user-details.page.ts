import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';

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
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.user = history.state.user;
    this.authService.me().subscribe(
      data =>{
        this.postService.getPostsByUserId(this.user.id, data.id).subscribe(
          posts => {console.log(data)
            this.posts = posts
      })
    })    
  }

}
