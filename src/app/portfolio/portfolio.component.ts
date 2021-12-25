import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../shares.service';
import {Router} from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Color, Label } from 'ng2-charts';
import { Console } from 'console';
import { element } from 'protractor';
import { DatePipe } from '@angular/common';

providers: [DatePipe]

export interface returnonasset{
  monthyear:Date;
  return:number;
  current:number;
  previous:number;
}
export interface returnonassets{
  year:number;
  return:number;  
}
export interface divHistory{
  year:number;
  return:number;  
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
  eqtQty=[] as number[];
  eqtTrandt=[] as Date[];
  divDt=[] as any[];
  divVal=[] as number[]
  
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
  public companyDividend=[] as divHistory[];
 // assetReturn=[] as returnonasset[];
  assetReturns=[] as returnonassets[];
  
  isMF:boolean=false;
  isShare:boolean=true;
  direction:string="asc";
  dividendTotal:number=0;
  previousMonthAsset:number=0;
  previousMonthInvst:number=0;
  option:number=0;
  folioId:number=0;
  pastYearReturn:number=0;
  shareName:string="";
  trnDt:Date=new Date();
 
  constructor(private _portfolio:SharesService,private route:ActivatedRoute,private router:Router, public datepipe: DatePipe) {  }

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
        if(element.sector!="Debt" && element.sector!="Equity" )
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
  //  this.assetReturn.length=0;
    this.assetReturns.length=0;
    
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
        this.assetHistoryTime.push(element.qtr+"-"+element.year); 
        
        this.assetValueHistory.push(parseFloat(element.assetValue.toFixed(2)));        
        this.dividendHistory.push(element.dividend);
        this.investmentHistory.push(parseFloat(element.investment.toString()).toFixed(2));
        console.log(element.qtr+"-"+element.year+" invst:"+element.investment);    
        let dt:Date = new Date(element.year,element.qtr);
        
        this.previousMonthAsset=element.assetValue;
        this.previousMonthInvst=element.investment;                  
        
      })      
    });

 
    this._portfolio.getAssetReturn(this.folioId,this.option)
    .subscribe(data=>{      
      data.forEach(element => {            
          let a:returnonassets={ year:element.year,return:element.return};        
          this.assetReturns.push(a);
      })
    });

    this.assetHistoryTime.length=0;
    this.dividendHistory.length=0;
    this.assetValueHistory.length=0;
    this.investmentHistory.length=0;
   // this.assetReturn.sort((a,b)=>a.monthyear-b.monthyear);

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
          return '#22a704';
    else
      return '#bf1722'
  }
  public getHeaderTrColor(x:any):string
  {   
    if(parseFloat(x)>=0)
          return '#fcff3b';
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
   if(e=="Year")
    {
      if(this.direction =="asc")
      {
        this.assetReturns.sort((a,b)=>b.year-a.year);
        this.direction ="desc";        
      } 
      else 
      {
        this.assetReturns.sort((a,b)=>a.year-b.year);
        this.direction ="asc";      
      }
    }
  }
  
  setradio(e: string): void   
  {       
    this.assetHistoryTime.length=0;
    this.assetValueHistory.length=0;
    this.investmentHistory.length=0;
    this.dividendHistory.length=0;
    this.eqCurrVal =0;
    this.eqInvstVal=0; 
      if(e=="share")
      {
        this.filterPortfolio =  this.portfolio.filter(s => s.equityType===1);
     
        for (var i = 0; i < this.filterPortfolio.length; i++) {
          
          this.eqInvstVal += this.filterPortfolio[i].qty*this.filterPortfolio[i].avgprice;          
          this.eqCurrVal +=  this.filterPortfolio[i].qty*this.filterPortfolio[i].livePrice;
          this.sdividend+= this.filterPortfolio[i].dividend;
           
        }
      this._portfolio.getAssetHistory(this.folioId,1)
        .subscribe(data=>{      
          data.forEach(element => {
                     
            this.assetHistoryTime.push(element.qtr.toString()+"-"+element.year.toString());
            this.assetValueHistory.push(parseFloat(element.assetValue).toFixed(2));        
            this.dividendHistory.push(element.dividend);
            this.investmentHistory.push(parseFloat(element.investment).toFixed(2));        
            let dt:Date = new Date(element.year,element.qtr);
            if(this.previousMonthAsset==0)
            {          
           
              this.previousMonthAsset=element.assetValue;
              this.previousMonthInvst = element.investment;          
            }
            else{
      
              this.previousMonthAsset=element.assetValue;
              this.previousMonthInvst=element.investment;                  
            }
          })      
        });
        this.assetReturns.length=0;
          this._portfolio.getAssetReturn(this.folioId, 1)
            .subscribe(data=>{      
              data.forEach(element => {            
                  let a:returnonassets={ year:element.year,return:element.return};        
                  this.assetReturns.push(a);
              })
            });
        }
        else if(e=="MF")
        {
          this.filterPortfolio =  this.portfolio.filter(s => s.equityType===2);
                
          for (var i = 0; i < this.filterPortfolio.length; i++){           
            this.eqInvstVal += this.filterPortfolio[i].qty*this.filterPortfolio[i].avgprice;
            this.eqCurrVal +=  this.filterPortfolio[i].qty*this.filterPortfolio[i].livePrice;
            this.sdividend =0;
          }
          this.assetReturns.length=0;
          this._portfolio.getAssetReturn(this.folioId, 2)
            .subscribe(data=>{      
              data.forEach(element => {            
                  let a:returnonassets={ year:element.year,return:element.return};        
                  this.assetReturns.push(a);
              })
            });
          //this.eqPLPercent = (this.eqCurrVal -this.eqInvstVal)*100/this.eqInvstVal;
          
          this._portfolio.getAssetHistory(this.folioId,2)
          .subscribe(data=>{      
            data.forEach(element => {              
              this.assetHistoryTime.push(element.qtr.toString()+"-"+element.year.toString());
              this.assetValueHistory.push(parseFloat(element.assetValue.toString()).toFixed(2));        
              
              this.investmentHistory.push(parseFloat(element.investment.toString()).toFixed(2));        
              let dt:Date = new Date(element.year,element.qtr);
              if(this.previousMonthAsset==0)
              {          
           
                this.previousMonthAsset=element.assetValue;
                this.previousMonthInvst = element.investment;          
              }
              else{
           
                this.previousMonthAsset=element.assetValue;
                this.previousMonthInvst=element.investment;                  
              }
            })      
          });
        }else if(e=="debt")
        {
          this.filterPortfolio =  this.portfolio.filter(s=> s.equityType==5);
           
          for (var i = 0; i < this.filterPortfolio.length; i++){           
            this.eqInvstVal += this.filterPortfolio[i].qty*this.filterPortfolio[i].avgprice;
            this.eqCurrVal +=  this.filterPortfolio[i].qty*this.filterPortfolio[i].livePrice;
            this.sdividend =0;
          }
          this.assetReturns.length=0;
          this._portfolio.getAssetReturn(this.folioId, 5)
            .subscribe(data=>{      
              data.forEach(element => {            
                  let a:returnonassets={ year:element.year,return:element.return};        
                  this.assetReturns.push(a);
              })
            });

           this._portfolio.getAssetHistory(this.folioId,5)
          .subscribe(data=>{      
            data.forEach(element => {              
              this.assetHistoryTime.push(element.qtr.toString()+"-"+element.year.toString());
              this.assetValueHistory.push(parseFloat(element.assetValue.toString()).toFixed(2));        
              
              this.investmentHistory.push(parseFloat(element.investment.toString()).toFixed(2));        
              let dt:Date = new Date(element.year,element.qtr);
              if(this.previousMonthAsset==0)
              {          
           
                this.previousMonthAsset=element.assetValue;
                this.previousMonthInvst = element.investment;          
              }
              else{
           
                this.previousMonthAsset=element.assetValue;
                this.previousMonthInvst=element.investment;                  
              }
            })      
          });
        }
        this.eqPLPercent = (this.eqCurrVal -this.eqInvstVal)*100/this.eqInvstVal;
  } 
  showdividend(e:string)
  {     
    this.divVal.length=0;
    this.divDt.length=0;
    this._portfolio.getDividend(e) 
    .subscribe(data => { 
      this.share = data;
      this.companyDividend=data;
      data.forEach(element => {
        this.dividendTotal += element.value;
         this.divDt.push(new Date(element.dt).getMonth()+"-"+new Date(element.dt).getFullYear());
         this.divVal.push(element.value);
         console.log(new Date(element.dt).getMonth());
      }); 
     });
     
    this._portfolio.getEqtTransaction(this.folioId, e)
    .subscribe(data => { 
      this.eqtTransaction=data;
      this.eqtQty.length=0;
      this.eqtTrandt.length=0;
      data.forEach(element=>{
        this.eqtQty.push(element.qty);
        let ss = this.datepipe.transform(element.tranDate, 'yyyy-MM-dd');//!=null?this.datepipe.transform(element.tranDate, 'yyyy/MM/dd'):new Date();
        this.eqtTrandt.push( ss!=null?new Date(ss).getMonth()+"-"+new Date(ss).getFullYear():new Date() );
        //console.log(this.eqtTransaction);
      });      
     });
     document.getElementById('sharedetails').style.display='block';
     


    this.shareName = e;
  }
  hideShareDetails()
  {
    document.getElementById('sharedetails').style.display='none';
  }
 //.................... Sector wise Chart........................
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

  //--------------------Asset History Chart -----------------------
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

  //---------------------Equity Investment History--------------------
  public eqtyHistorylbl: Label[] = this.eqtTrandt; 
  public barChartType3: ChartType = 'bar';
  public barChartPlugins3 = []; 
  public barChartColors3: Color[] = [
    { backgroundColor: '#a05195 ' },
    { backgroundColor: '#08b100db' },     
  ]
  public getEquityInvstmt:ChartDataSets[] = [
    { data:this.eqtQty, label: 'No Of Shares',stack:'a' }    
  ];

  //-------------------  Dividend Snapshot ----------------------------
  public eqtyHstryDiv: Label[] = this.divDt; 
  public barChartType3: ChartType = 'bar';
  public barChartPlugins3 = [];
  public barChartColors4: Color[] = [
    { backgroundColor: 'green ' },
    { backgroundColor: '#08b100db' },     
  ]
  public getDivReturn:ChartDataSets[] = [
    { data:this.divVal, label: 'Dividend',stack:'a' }    
  ];


}
