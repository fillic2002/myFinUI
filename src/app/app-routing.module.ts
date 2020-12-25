import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OptionComponent } from './option/option.component';
import { SharesdetailComponent } from './sharesdetail/sharesdetail.component';

const routes: Routes = [
  {path:'option', component:OptionComponent},
  {path:'option/:id',component:SharesdetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComp =[SharesdetailComponent,OptionComponent] 