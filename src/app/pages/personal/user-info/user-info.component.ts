import { Component, Input, OnInit } from '@angular/core';
import { UserExtended } from 'src/app/core/interfaces/User';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent  implements OnInit {

  @Input() user: UserExtended | undefined;

  constructor() { }

  ngOnInit() {}

}
