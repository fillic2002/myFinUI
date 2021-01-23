import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SharesService } from '../shares.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  public portfolio =[] as any;
  public total:any;
  public share=[] as any;
  
  
  constructor(private _portfolio:SharesService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {    
     this._portfolio.getPortfolio(1)
     .subscribe(data => {
       this.portfolio = data;    
       
      });
  }
  changeFolio(e :any) {
    this._portfolio.getPortfolio(e.target.value)
     .subscribe(data =>{
        this.portfolio = data;
        var to:number;
     to=0;
     for (var i = 0; i < this.portfolio.length; i++) {
       to= to + parseFloat(this.portfolio[i].avgprice)*parseFloat(this.portfolio[i].qty);        
     }
     this.total=to.toFixed(2);    
     console.log(this.total); 
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
}
