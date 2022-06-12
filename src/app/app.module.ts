import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComp } from './app-routing.module';
import { AppComponent } from './app.component';
import { OptionComponent } from './option/option.component';
import { SharesService } from './shares.service';
import { HttpClientModule} from '@angular/common/http'
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TransactionComponent } from './transaction/transaction.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BankdetailComponent } from './bankdetail/bankdetail.component';
import { SortDirective } from './directive/sort.directive';
import {TaxcompuComponent} from './taxcompu/taxcompu.component'
 
//import { ChartModule } from '@syncfusion/ej2-angular-charts';
import{ChartsModule} from 'ng2-charts'
import { DatePipe } from '@angular/common';
import { CommonYrComponent } from './common-yr/common-yr.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import { ExpenseComponent } from './expense/expense.component';
 

@NgModule({
  declarations: [
    AppComponent,
    OptionComponent,
    PortfolioComponent,
    TransactionComponent,
    routingComp,
    DashboardComponent,
    BankdetailComponent,
    SortDirective,
    TaxcompuComponent,
    CommonYrComponent,
    AdminComponent,
    ExpenseComponent,   
     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    FormsModule 
  ],
  providers: [SharesService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }