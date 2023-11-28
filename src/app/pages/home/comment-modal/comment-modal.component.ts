import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent  implements OnInit {

  @Input() postId: number | undefined;
  @Input() comments: any[] | undefined; // Asegúrate de tener la interfaz adecuada para los comentarios

  // No necesitas inyectar CommentService aquí ya que los comentarios son pasados directamente

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Los comentarios ya están disponibles en this.comments
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
