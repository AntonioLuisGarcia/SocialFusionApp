import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostExtended } from 'src/app/core/interfaces/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';

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
    ) {}
  
  posts: PostExtended[] | any;
  
  
  ngOnInit() {
    // Suscribirse al observable para obtener los posts
    this.postService.getAllPost().subscribe((data) => {
      this.posts = data;
    });
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
}
