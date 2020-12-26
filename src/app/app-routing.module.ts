import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OptionComponent } from './option/option.component';

import { SharesdetailComponent } from './sharesdetail/sharesdetail.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const routes: Routes = [
  {path:'', component:OptionComponent},
  {path:'shares',component:SharesdetailComponent},
  {path:'portfolio',component:PortfolioComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComp =[SharesdetailComponent,OptionComponent] 