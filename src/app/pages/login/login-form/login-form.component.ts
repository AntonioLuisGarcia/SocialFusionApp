import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/core/interfaces/UserCredentials';
import { PasswordValidation } from 'src/app/core/validators/password';
import { usernameValidators } from 'src/app/core/validators/username';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent  implements OnInit {

  @Input('username') set username(value: string){
    this.form?.controls['username'].setValue(value);
  }

  @Output() onsubmit = new EventEmitter<UserCredentials>();

  form: FormGroup | null = null;
  constructor(
    private formBuilder:FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      username:['', [Validators.required, usernameValidators.noSpacesInName()]],
      password:['', [Validators.required, usernameValidators.noSpacesInName(), PasswordValidation.passwordProto()]]
    });
  }

  ngOnInit() {}

  onSubmit(){
    this.onsubmit.emit(this.form?.value);
    this.form?.controls['password'].setValue('');
  }


//Revisar ESTO

  hasError(control:string, error:string):boolean{
    let errors = this.form?.controls[control].errors;
    console.log("Tiene espacios")
    return errors!=null && error in errors;
  }

}