import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class usernameValidators{

    public static noSpacesInName():ValidatorFn{
        return (control: AbstractControl): ValidationErrors | null =>{
            const value = control.value;

            if (typeof value === 'string' && value.includes(' ')) {
                return { 'noSpacesAllowed': true };
            }

            return null;
        };
    }
}