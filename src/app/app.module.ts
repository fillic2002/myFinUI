import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComp } from './app-routing.module';
import { AppComponent } from './app.component';
import { OptionComponent } from './option/option.component';
import { SharesService } from './shares.service';

@NgModule({
  declarations: [
    AppComponent,
    OptionComponent,
    routingComp
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [SharesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
