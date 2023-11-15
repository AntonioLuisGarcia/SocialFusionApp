import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from './core/services/translation.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  lang:string = "es";
  constructor(
    public translate:TranslationService,
    private auth:AuthService,
    private router:Router
  ) {
    this.auth.isLogged$.subscribe((logged: any)=>{
      if(logged)
        this.router.navigate(['/home']);
    });
    this.translate.use(this.lang);
  }
 
  onLang(){
    if(this.lang=='es')
      this.lang='en';
    else
      this.lang='es';
    
    this.translate.use(this.lang);
    return false;    
  }

  use(lang: string){
    this.translate.use(lang);
  }
}
