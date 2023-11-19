import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostExtended } from 'src/app/core/interfaces/post';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  //llamo a los servicios 
  constructor(private auth:AuthService,
    private router:Router
    ) {}
  
  posts: PostExtended[] | any;
  
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
