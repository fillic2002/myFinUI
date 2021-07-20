import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../shares.service';
import {Router} from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Color, Label } from 'ng2-charts';
import { Console } from 'console';

export interface returnonasset{
  monthyear:Date;
  return:number;
  current:number;
  previous:number;
}
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'] 
})

export class PortfolioComponent implements OnInit {

  public portfolio =[] as any;
  public filterPortfolio =[] as any;
  public eqtTransaction=[] as any;
  
  public sharecount:number=0;
  public sdividend:number=0;
  public eqInvstVal:number=0;
  public eqCurrVal:number=0;
  public mfInvstVal:number=0;
  public share=[] as any;
  public pfcount:any;
  public mfCurrVal:number=0;  
  public mfPLPercent:number=0;
  public eqPLPercent:number=0;
  public mfCount:number=0;
  public sector=[] as string[];  
  public assetValue =[] as number[];
  public dividendHistory=[] as number[];
  public assetValueHistory=[] as number[];
  public investmentHistory=[] as number[];
  public assetHistoryTime=[] as string[];
  public companyDividend=[] as number[];
  assetReturn=[] as returnonasset[];
  isMF:boolean=false;
  isShare:boolean=true;
  direction:string="asc";
  dividendTotal:number=0;
  previousMonthAsset:number=0;
  option:number=0;
  folioId:number=0;
 

  constructor(private _portfolio:SharesService,private route:ActivatedRoute,private router:Router) {  }

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
    this.sector.length=0;
    this.folioId=e.target.value;
    this.assetValue.splice(0,this.assetValue.length);     
    this._portfolio.getPortfolio(e.target.value)
     .subscribe(data =>{
       
      data.forEach(element => {
        element.profit= element.qty*(element.livePrice - element.avgprice);
        element.percentage = (element.livePrice - element.avgprice)*100/element.avgprice;
        if(element.sector!="undefined")
        {           
          if(this.sector.indexOf(element.sector)<=-1 )
          {
            if(element.sector!="")
            {
            this.sector.push(element.sector);
            this.assetValue[this.sector.indexOf(element.sector)]=0;
            }
          }
        }
        if(element.sector!="")
          {
            this.assetValue[this.sector.indexOf(element.sector)] = this.assetValue[this.sector.indexOf(element.sector)] + element.avgprice*element.qty;
          }
      });
    this.sector = this.sector.filter((e, i) => i === this.sector.indexOf(e))
     
    this.portfolio = data;
    //console.log("asd");
    this.sharecount =0;this.mfPLPercent=0;
    var eto:number;
    var mto:number;var mato:number;
    var eato:number;eto=0;eato=0;
    mto=0;mato=0;this.sdividend=0;
 
     for (var i = 0; i < this.portfolio.length; i++) {
       if(this.portfolio[i].equityType==1)
       {
        eto= eto + parseFloat(this.portfolio[i].avgprice)*parseFloat(this.portfolio[i].qty);        
        eato= eato + parseFloat(this.portfolio[i].livePrice)*parseFloat(this.portfolio[i].qty);
        this.sharecount +=1;
        this.sdividend+= this.portfolio[i].dividend;
       }
       else
       {
        mto= mto + parseFloat(this.portfolio[i].avgprice)*parseFloat(this.portfolio[i].qty); 
        mato= mato + parseFloat(this.portfolio[i].livePrice)*parseFloat(this.portfolio[i].qty);
        this.mfCount +=1;
       }
     }
     this.eqInvstVal=eto;
     this.eqCurrVal = eato;
     this.eqPLPercent = (eato-eto+this.sdividend)*100/eto;
     this.mfInvstVal=mto;    
     this.mfCurrVal =mato; 
     this.mfPLPercent = (this.mfCurrVal-this.mfInvstVal)*100/this.mfInvstVal;
     this.barChartLabels=this.sector;
     //console.log(this.portfolio);
     this.filterPortfolio =this.portfolio;
   
    });
    this.assetReturn.length=0;
    
    if(this.isShare)
    {
      this.option=1;
    }
    else
    {
      this.option=5;
    }
    
    this._portfolio.getAssetHistory(e.target.value,this.option)
    .subscribe(data=>{      
      data.forEach(element => {              
        this.assetHistoryTime.push(element.qtr.toString()+"-"+element.year.toString());
         this.assetValueHistory.push(parseFloat(element.assetValue.toString()).toFixed(2));        
        this.dividendHistory.push(element.dividend);
        this.investmentHistory.push(parseFloat(element.investment.toString()).toFixed(2));        
        let dt:Date = new Date(element.year,element.qtr);
        if(this.previousMonthAsset==0)
        {
          
          let a:returnonasset={ monthyear:dt,return:element.assetValue};        
          this.assetReturn.push(a);
          this.previousMonthAsset=element.assetValue;            
        }
        else{
          //console.log(element.assetValue+"--"+this.previousMonthAsset);
          let a:returnonasset={ monthyear:dt,return:((element.assetValue-this.previousMonthAsset)*100/this.previousMonthAsset),
          current:element.assetValue.toFixed(2),previous:this.previousMonthAsset.toFixed(2)};          
          this.assetReturn.push(a);
          this.previousMonthAsset=element.assetValue;                  
        }
      })       
    });

    this.assetHistoryTime.length=0;
    this.dividendHistory.length=0;
    this.assetValueHistory.length=0;
    this.investmentHistory.length=0;
    this.assetReturn.sort((a,b)=>b.monthyear-a.monthyear);

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
  public selectnext(option:any)
  {    
    this.router.navigate(['/transaction']);  
  }
  public selecttype(option:any)
  {    
    for (var i = 0; i < this.portfolio.length; i++) {
    }   
  }
  public getTrColor(x:any):string
  {   
    if(parseFloat(x)>=0)
          return '#0b893e';
    else
      return '#bf1722'
  }
   
  sort(e:string) {
      //console.log(e);
   
      if(e=="current")
      {
        if(this.direction =="asc")
        {
          this.assetReturn.sort((a,b)=>a.current-b.current);
          this.direction ="desc";
        }
        else 
        {
          this.assetReturn.sort((a,b)=>b.current-a.current);
          this.direction ="asc";
        }
     }
      if(e=="Dividend")
      {
        if(this.direction =="asc")
        {
          this.filterPortfolio.sort((a,b)=>a.dividend-b.dividend);
          this.direction ="desc";
        }
        else 
        {
          this.filterPortfolio.sort((a,b)=>b.dividend-a.dividend);
          this.direction ="asc";
        }
     }
      if(e=="Divyield")
      {
        if(this.direction =="asc")
        {
          this.filterPortfolio.sort((a,b)=>(a.dividend/(a.qty*a.avgprice))-(b.dividend/(b.qty*b.avgprice)));
          this.direction ="desc";
        }
        else 
        {
          this.filterPortfolio.sort((a,b)=>(b.dividend/(b.qty*b.avgprice))-(a.dividend/(a.qty*a.avgprice)));
          this.direction ="asc";
        }
     }
     if(e=="name")
     {
       if(this.direction =="asc")
       {
         this.filterPortfolio.sort((a,b)=>(a.equityname>b.equityname)?1:-1);
         this.direction ="desc";
       }
       else 
       {
         this.filterPortfolio.sort((a,b)=>(b.equityname-a.equityname)?1:-1);
         this.direction ="asc";
       }
    }
     if(e=="Return")
      {
        if(this.direction =="asc")
        {
          this.filterPortfolio.sort((a,b)=>a.percentage-b.percentage);
          this.direction ="desc";
        }
        else 
        {
          this.filterPortfolio.sort((a,b)=>b.percentage-a.percentage);
          this.direction ="asc";
        }
     }
     if(e=="Investment")
     {
       if(this.direction =="asc")
       {
         this.filterPortfolio.sort((a,b)=>a.qty*a.avgprice-b.qty*b.avgprice);
         this.direction ="desc";
       }
       else 
       {
        this.filterPortfolio.sort((a,b)=>b.qty*b.avgprice-a.qty*a.avgprice);
         this.direction ="asc";
       }
    }
    if(e=="Gain")
    {
      if(this.direction =="asc")
      {
        this.filterPortfolio.sort((a,b)=>b.profit-a.profit);
        this.direction ="desc";
      }
      else 
      {
        this.filterPortfolio.sort((a,b)=>a.profit-b.profit);
        this.direction ="asc";
      }
   }
   if(e=="Month")
    {
      if(this.direction =="asc")
      {
        this.assetReturn.sort((a,b)=>b.monthyear-a.monthyear);
        this.direction ="desc";
      }
      else 
      {
        this.assetReturn.sort((a,b)=>a.monthyear-b.monthyear);
        this.direction ="asc";
      }
    }
  }
  
  setradio(e: string): void   
  {        
        this.isMF = !this.isMF;
        this.isShare=!this.isShare;
        if(e=="share")
          this.filterPortfolio =  this.portfolio.filter(s => s.equityType===1);
        else  
          this.filterPortfolio =  this.portfolio.filter(s => s.equityType===2 ||s.equityType===5 );
  }
  showdividend(e:string)
  {     
    this._portfolio.getDividend(e)
    .subscribe(data => { 
      this.share = data;
      this.companyDividend=data;
      data.forEach(element => {
        this.dividendTotal += element.value;
        console.log( element.value);
      });
     });

     
  
    this._portfolio.getEqtTransaction(this.folioId, e)
    .subscribe(a => { 
      this.eqtTransaction=a;
      console.log(a);
     });

     document.getElementById('sharedetails').style.display='block';
  }
  hideShareDetails()
  {
    document.getElementById('sharedetails').style.display='none';
  }
 // Sector wise Chart
  public barChartOptions: ChartOptions = {
    responsive: true,
    
  };

  public barChartLabels: Label[] = this.sector; 
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    { backgroundColor: 'skyblue ' },
    { backgroundColor: '#08b100db' },
    
  ]
  public barChartData: ChartDataSets[] = [
    { data:this.assetValue, label: 'Sector Invested',stack:'a' }
    
  ];

  //Asset History Chart 
  public barChartOptions2: ChartOptions = {
    responsive: true,
  };
  public assetHistorylbl: Label[] = this.assetHistoryTime; 
  public barChartType2: ChartType = 'line';
  public barChartLegend2 = true;
  public barChartPlugins2 = [];
  
  public getfolioAssetHistory: ChartDataSets[] = [
    { data:this.investmentHistory, label: 'Investment' },        
    { data:this.assetValueHistory, label: 'Current Value' },     
    { data:this.dividendHistory, label: 'Dividend' },
  ];
}
