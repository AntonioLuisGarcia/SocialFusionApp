import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent  implements OnInit {

  @Input() user: any;
  @Output() onClickUser = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  userClicked() {
    this.onClickUser.emit(this.user.id);
  }

}
