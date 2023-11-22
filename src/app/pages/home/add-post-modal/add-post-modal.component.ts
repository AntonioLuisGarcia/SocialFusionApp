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
    private formBuilder: FormBuilder
  ) {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  // Método para cerrar el modal
  dismissModal() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.postForm.valid) {
      // Lógica para enviar los datos del formulario
      // Después de enviar, puedes cerrar el modal también
      this.dismissModal();
    }
  }
  
  ngOnInit() {}

}
