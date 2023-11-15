import { BehaviorSubject, Observable, lastValueFrom, map, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { UserCredentials } from '../interfaces/UserCredentials';
import { UserRegister } from '../interfaces/UserRegister';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';
import { StrapiExtendedUser, StrapiLoginPayload, StrapiLoginResponse, StrapiRegisterPayload, StrapiRegisterResponse, StrapiUser } from '../interfaces/strapi';
import { User } from '../interfaces/User';


export class AuthStrapiService extends AuthService{

  constructor(
    private jwtSvc:JwtService,
    private apiSvc:ApiService
  ) { 
    super();
    this.init();
  }

  private init(){
    this.jwtSvc.loadToken().subscribe(
      {
        next:(logged)=>{
          this._logged.next(logged!='');
        },
        error:(err)=>{
          console.log("No hay token");
        }
      }      
    );
  }

  public login(credentials:UserCredentials):Observable<void>{
    return new Observable<void>(obs=>{
      const _credentials:StrapiLoginPayload = {
        email:credentials.email,
        password:credentials.password
      };
      this.apiSvc.post("/auth/local", _credentials).subscribe({
        next:async (data:StrapiLoginResponse)=>{
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          this._logged.next(data && data.jwt!='');
          obs.next();
          obs.complete();
        },
        error:err=>{
          obs.error(err);
        }
      });
    });
  }

  logout():Observable<void>{
    return this.jwtSvc.destroyToken().pipe(map(_=>{
      this._logged.next(false);
      return;
    }));
  }

  register(info:UserRegister):Observable<void>{
    return new Observable<void>(obs=>{
      const _info:StrapiRegisterPayload = {
        name:info.name,
        email:info.email,
        username:info.username,
        password:info.password
      }
      this.apiSvc.post("/auth/local/register", info).subscribe({
        next:async (data:StrapiRegisterResponse)=>{
          let connected = data && data.jwt !='';
          this._logged.next(connected);
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          const _extended_user:StrapiExtendedUser = {
            name:info.name,
            username:info.username,
            user_id:data.user.id,
            /////////////////////////
          }
          await lastValueFrom(this.apiSvc.post("/extended_user", _extended_user)).catch;
          obs.next();
          obs.complete();
        },
        error:err=>{
          obs.error(err);
        }
      });
    });
  }

  public me():Observable<User>{
    return new Observable<User>(obs=>{
      this.apiSvc.get('/users/me').subscribe({
        next:async (user:StrapiUser)=>{
          let extended_user = await lastValueFrom(this.apiSvc.get(`/extended-users?filters[user_id]=${user.id}`));
          let ret:User = {
            id:user.id,
            name:extended_user.name,
            username:extended_user.username,
            email:extended_user.email,
            password:extended_user.password,
            description:extended_user.description,
            img:extended_user.img,
          }
          obs.next(ret);
          obs.complete();
        },
        error: err=>{
          obs.error(err);
        }
      });
    });
    
  }
}
