import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SharesService } from '../shares.service';
import {Router} from '@angular/router';
import { containsRect } from '@syncfusion/ej2-angular-charts';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  public portfolio =[] as any;
  public eqtotal:any;
  public mftotal:any;
  public share=[] as any;
  public pfcount:any;
  public pfActTotal:any;
  
  
  
  
  constructor(private _portfolio:SharesService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {    
     this._portfolio.getPortfolio(1)
     .subscribe(data => {
       this.portfolio = data;
       data.forEach(element => {
          element.profit= element.qty*element.livePrice - element.avgprice;
        });
      });
  }
  changeFolio(e :any) {
    this._portfolio.getPortfolio(e.target.value)
     .subscribe(data =>{
      data.forEach(element => {
        element.profit= element.qty*(element.livePrice - element.avgprice);
        element.percentage = (element.livePrice - element.avgprice)*100/element.avgprice;
        
      });
    this.portfolio = data;
        
    var eto:number;
    var mto:number;
    var mato:number;
    var eato:number;
    eto=0;eato=0;
    mto=0;mato=0;
 
     for (var i = 0; i < this.portfolio.length; i++) {
       if(this.portfolio[i].equityType==1)
       {
        eto= eto + parseFloat(this.portfolio[i].avgprice)*parseFloat(this.portfolio[i].qty);        
        eato= eato + parseFloat(this.portfolio[i].livePrice)*parseFloat(this.portfolio[i].qty);     
       }
       else
       {
        mto= mto + parseFloat(this.portfolio[i].avgprice)*parseFloat(this.portfolio[i].qty); 
        mato= mato + parseFloat(this.portfolio[i].livePrice)*parseFloat(this.portfolio[i].qty);
       }
     }
     this.eqtotal=eto.toFixed(2);
     this.mftotal=mto.toFixed(2);    
     this.pfActTotal =mato.toFixed(2);  
    });
  }
  onClick(option:any)
  {
    this._portfolio.getlivePrice()
    .subscribe(data => {
      this.share = data;     
     });
  } 
  public onSelect(option:any)
  {    
    this.router.navigate(['/']);   
  }
  public selecttype(option:any)
  {    
    for (var i = 0; i < this.portfolio.length; i++) {
      console.log(this.portfolio[i].avgprice)
    }   
  }
  public getTrColor(x:any):string
  {
    console.log(x);
    if(parseFloat(x)>=0)
          return 'green';
    else
      return 'red'
  }
}
