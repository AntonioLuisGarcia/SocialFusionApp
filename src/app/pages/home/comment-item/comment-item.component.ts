import { Component, OnInit, Input } from '@angular/core';
import { Comment, CommentWithUserName } from 'src/app/core/interfaces/Comment';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
})
export class CommentItemComponent implements OnInit {
  @Input() comment: CommentWithUserName | undefined // Asegúrate de definir una interfaz adecuada para esto

  constructor() { }

  ngOnInit() {}

}

