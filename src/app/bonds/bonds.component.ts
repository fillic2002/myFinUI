import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharesService } from '../shares.service';

@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.css']
})
export class BondsComponent implements OnInit {

  selectedfolio:number=0;
  bondDetails=[] as any[];
  bondTransaction=[] as any[];
  totalInvst:number=0;
  direction:string="asc";
  constructor(private _shrdServ:SharesService,private router:Router) { }
  ngOnInit(): void {
     this._shrdServ.getBondDetails.subscribe(data =>{ 
        this.bondDetails=data;
      });
    } 
  GetNetBondPurchsed(){
    this._shrdServ.getBondTransaction(this.selectedfolio)
      .subscribe(data =>{ 
        this.bondTransaction =data;
        data.forEach(element => {
          this.totalInvst += element.qty*element.invstPrice;
           
        }); 
      });
  }
  public selectnext(option:any){    
    this.router.navigate(['/admin']);  
  }
  public onSelect(option:any)
  {    
    this.router.navigate(['/']);
  }
  sort(e:string) {   
    if(e=="liveprice")
      { 
        if(this.direction =="asc")
        {        
          this.bondDetails.sort((a: { livePrice: number; },b: { livePrice: number; })=>a.livePrice-b.livePrice);
          this.direction ="desc";
        }
        else 
        {
          this.bondDetails.sort((a: { livePrice: number; },b: { livePrice: number; })=>b.livePrice-a.livePrice);     
          this.direction ="asc";
        }
     }
     else if(e=="ytm")
     { 
       if(this.direction =="asc")
       {        
         this.bondDetails.sort((a: { ytm: number; },b: { ytm: number; })=>a.ytm-b.ytm);
         this.direction ="desc";
       } 
       else 
       {
         this.bondDetails.sort((a: { ytm: number; },b: { ytm: number; })=>b.ytm-a.ytm);     
         this.direction ="asc";
       }
    }
    else if(e=="maturity")
     { 
       if(this.direction =="asc")
       {        
        this.bondDetails.sort((a,b)=>(a.dateOfMaturity>b.dateOfMaturity)?1:-1);       
         this.direction ="desc";
       }
       else  
       {
        this.bondDetails.sort((a,b)=>(b.dateOfMaturity>a.dateOfMaturity)?1:-1);       
         this.direction ="asc"; 
       }
    }
    }
}
