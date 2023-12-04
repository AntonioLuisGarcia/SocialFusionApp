/// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

/// Rxjs
import { debounceTime } from 'rxjs';

/// Service
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchControl = new FormControl();
  filteredUsers = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500)) // 500 milisegundos de retraso
      .subscribe(value => {
        this.searchUsers(value); // Método para buscar usuarios
      });
  }
  
  searchUsers(query: string) {
    if(query) {
      this.authService.searchUser(query).subscribe(results => {
        this.filteredUsers = results;
      });
    }
  }
  
  userClicked(userId: number) {
    console.log(`User with ID ${userId} was clicked.`);
    this.authService.getUser(userId).subscribe( data =>{
      console.log(data)
      let navigationExtras: NavigationExtras = {
        state: {
          user: data
        }
      };
      this.router.navigate(['user-details'], navigationExtras);
    })
  }

}
