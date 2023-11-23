import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '../core/translate/translate';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormatDatePipe } from './pipe/format-date.pipe';
import { ImageSelectableComponent } from './components/image-selectable/image-selectable.component';



@NgModule({
  declarations: [
    SidebarComponent,
    ImageSelectableComponent,
    FormatDatePipe,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
  ],
  exports:[
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SidebarComponent,
    ImageSelectableComponent,
    FormatDatePipe,
  ]
})
export class SharedModule { }
