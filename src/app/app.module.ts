import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComp } from './app-routing.module';
import { AppComponent } from './app.component';
import { OptionComponent } from './option/option.component';
import { SharesService } from './shares.service';
import {HttpClientModule} from '@angular/common/http'
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TransactionComponent } from './transaction/transaction.component';
 

@NgModule({
  declarations: [
    AppComponent,
    OptionComponent,
    PortfolioComponent,
    TransactionComponent,
    routingComp
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [SharesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
