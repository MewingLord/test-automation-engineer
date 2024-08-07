import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ListComponent } from './list/list.component';
import { ShowComponent } from './show/show.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';


@NgModule({
  declarations: [
    ListComponent,
    ShowComponent,
    CreateComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
