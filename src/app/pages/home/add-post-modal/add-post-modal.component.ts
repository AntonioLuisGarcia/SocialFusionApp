import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-post-modal',
  templateUrl: './add-post-modal.component.html',
  styleUrls: ['./add-post-modal.component.scss'],
})
export class AddPostModalComponent  implements OnInit {

  postForm: FormGroup;

  
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
  ) {
    this.postForm = this.formBuilder.group({
      description: ['', Validators.required],
      image: [''],
    });
  }

  // Método para cerrar el modal
  dismissModal() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.postForm.valid) {
      const post = {
        image: this.postForm.get('image')?.value || null, // Si la imagen es nula, asignamos null
        description: this.postForm.get('description')?.value
      };
  
      // Se cierra el modal y devolvemos el mensaje de 'ok' y el post
      this.modalController.dismiss({ post: post, status: 'ok' });
    }
  }
  
  ngOnInit() {}

}
