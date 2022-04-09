import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../shares.service';
import {Router} from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Color, Label } from 'ng2-charts';
import { debug } from 'console';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  public portfolio =[] as any;
  public PFAcctDetails =[] as any;
  public filterPortfolio =[] as any;
  public equitytransaction =[] as any;
  public folio =[] as any;
  public status!: string;
  public eqtotal:any;
  public mftotal:any;
  public selectedLevel:any;
  public selectedfolio: any;
  public purchaseOption: any="B";
  isShown: boolean = true;
  public assetType: Number=1;
  public assetId: any;
  public buttonName:any = 'Show';
  public show:boolean = false;
  public trnStatus:string='Add >'
  public result=[] as any;
  public companyid: string="";
  public yearEqt: number[] = [];
  public invstEqt =[] as number[];
  public yearMF =[] as number[];
  public invstMF =[] as number[];
  public yearDebt =[] as number[];
  public invstDebt =[] as number[];
  invstmnt=[] as number[];
  intrest=[] as number[];
  year=[] as number[];
  showresult: boolean = false ;
  qty: any;
  direction:string="asc";
  //isMF:boolean=false;
  isShare:boolean=true;

  constructor(private _eqTransaction:SharesService,private route:ActivatedRoute,private  router:Router) { }

  ngOnInit(): void {
    this._eqTransaction.getTransaction(0)
    .subscribe(data =>{
     this.equitytransaction = data
     this.filterPortfolio=data;
     var to:number;
     to=0;  
     for (var i = 0; i < this.equitytransaction.length; i++) {
       to= to + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
     }
     this.eqtotal=to.toFixed(2);     
    }); 

    this._eqTransaction.getYearlyInvestment("Yearly")
    .subscribe(data =>{
      data.forEach(element => {
         
        if(element.assettype==1)
          {
            this.yearEqt.push(element.year)
             
            this.invstEqt.push(element.investment.toFixed(2));
          }
          if(element.assettype==2)
          {
            this.yearMF.push(element.year)
            this.invstMF.push(element.investment.toFixed(2));
          }
          if(element.assettype==5)
          {
            this.yearDebt.push(element.year)
            this.invstDebt.push(element.investment.toFixed(2));
          }
      });
      this.yearEqt.reverse();
      this.invstEqt.reverse();
      this.invstMF.reverse();
      this.yearMF.reverse();
      this.yearDebt.reverse();
      this.invstDebt.reverse();
    });  
    this.intrest.length=0;
    this.invstmnt.length=0;
    this._eqTransaction.getPFAcDetails('2', 4)
    .subscribe(data =>{       
      this.PFAcctDetails=data;
      data.forEach(element=>{
      this.addYear(element.year);         
      if(element.typeOfTransaction=="int")
        { 
          var inv:number=0;
          inv= element.investmentEmplr+element.investmentEmp;     
          this.intrest.push(inv);   
      }else if(element.typeOfTransaction=="Deposit")
        {
          var inv:number=0;
          inv= element.investmentEmplr+element.investmentEmp;     
          this.invstmnt.push(inv);        
        }
      });       
    });    
  }
  
  AddTransaction():void  {
    if(document.getElementById('txtName') == null)
    {
      this.assetId =""
    }
    else{
      this.assetId = document.getElementById('txtName');
    }
    debugger;
    this.qty = document.getElementById('txtQty');
    var PB = document.getElementById('txtPB');
    this.qty=this.qty.value.replace(',','');
    var mv=document.getElementById('txtMaretCap');
    this._eqTransaction.postTransaction(document.getElementById('txtPrice'),
          this.assetId,
          this.qty,
          document.getElementById('txtDt'),
          this.selectedfolio,
          this.purchaseOption,
          this.assetType,
          PB,mv
      )
    .subscribe(data => {
     var status= document.getElementById('status')
     this.status="Record "+this.purchaseOption+" Successfully for: "+this.assetId +" in portfolio: "+this.selectedfolio;

     this.ngOnInit();      
    })
     
    document.getElementById('status').style.display='block';
  }
  add(){ 
      this._eqTransaction.getAllfolio()
    .subscribe(datan =>{ 
      this.folio = datan;
    });
   
  }
  hideShareDetails()
  {
    document.getElementById('status').style.display='none';
  } 
  public onSelect(option:any)
  {    
    this.router.navigate(['/']);
  }
  public selectnext(option:any)
  { 
    if(option='Portfolio')   
      this.router.navigate(['/portfolio']);
    if(option='Tax')   
      this.router.navigate(['/tax']);
  }
  public selectFolio()
  {    
    this.router.navigate(['/portfolio']);   
  }
  
  selected(){
 
  }
  changeFolio(e :any) {
    this.status="";
    
    this.selectedfolio=e.target.value;
    console.log(this.selectedfolio);
    this._eqTransaction.getTransaction(e.target.value)
    .subscribe(data =>{
      this.portfolio=data;
      this.equitytransaction = data
      
      var eqto:number;
      var mfto:number;
      eqto=0;
      mfto=0;
      for (var i = 0; i < this.equitytransaction.length; i++) {
       if(this.equitytransaction.equityType=1){
        eqto= eqto + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
       }
       else
       {
        mfto= mfto + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
       }
     }
     this.eqtotal=eqto.toFixed(2);
     this.mftotal=mfto.toFixed(2);
     if(this.isShare)
         this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===1);
     else  
         this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===2 ||s.assetType===5 );
    });
    this.intrest.length=0;
    this.invstmnt.length=0;
    this._eqTransaction.getPFAcDetails('2', 4)
    .subscribe(data =>{       
      this.PFAcctDetails=data;
      data.forEach(element=>{
      this.addYear(element.year);         
      if(element.typeOfTransaction=="int")
        { 
          var inv:number=0;
          inv= element.investmentEmplr+element.investmentEmp;     
          this.intrest.push(inv);   
      }else if(element.typeOfTransaction=="Deposit")
        {
          var inv:number=0;
          inv= element.investmentEmplr+element.investmentEmp;     
          this.invstmnt.push(inv);        
        }
      });       
    });
    
  }
  private addYear(yr:number)
  {     
    var found=this.year.indexOf(yr);
    if(found < 0)
    {
      this.year.push(yr);
    }   
  }
  changeDate(e:any){
    this.status="";
  }
  selectOption(e:any)
  {
    this.purchaseOption = e.target.value;
  }
  changeAsset(e:any)
  {   
    this.assetType =e.target.value;
     if(e.target.value==12 || e.target.value==7|| e.target.value==8)
      {
        this.isShown = ! this.isShown;
      }
     else
     {
       this.isShown =true;
     }
     this._eqTransaction.getTransaction(this.selectedfolio)
    .subscribe(data =>{

     this.equitytransaction = data
     var to:number;
     to=0;
     for (var i = 0; i < this.equitytransaction.length; i++) {
       to= to + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
     }
     this.eqtotal=to.toFixed(2);
    });
  }
  public showTrans() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show){
      this.buttonName = "Hide";
      this.trnStatus ='Hide';
    }
    else{
      this.buttonName = "Show";
      this.trnStatus ='Add >';
    }
  }
  public getasset(e:any)
  {    
    if(e.target.value.length>2)
    {    
      this.showresult =true;
      this._eqTransaction.getShare(e.target.value)
      .subscribe(data =>{
        this.result = data;
      });
    }
  }
  public getId(e:any)
  {    
    this.showresult =false;
    this.companyid=e;
   // alert(e);
  }
  public deleterecord(id:any,dt:any)
  {
    if(confirm("Are you sure to delete ")) {    
    
    this._eqTransaction.deleteTransaction(id, dt)
      .subscribe(data =>{
        this.result = data;        
      });
   }
  }
  public getTrColor(x:any):string
  {   
   
    if(x=='B')
          return '#08b100db';
    else
      return '#ff000091'
  }
  sort(e:string) {
     
    if(e=="ID")
    {
      if(this.direction =="asc")
      {         
        this.filterPortfolio.sort((a,b)=>(a.equityId>b.equityId)?1:-1);
        this.direction ="desc";
      }
      else
      {
        this.filterPortfolio.sort((a,b)=>(b.equityId>a.equityId)?1:-1);
        this.direction ="asc"; 
      }
   }
   if(e=="purchaseDt")
   {      
     if(this.direction =="asc")
     {
       this.filterPortfolio.sort((a,b)=>(a.tranDate>b.tranDate)?1:-1);
       this.direction ="desc";
     }  
     else 
     {
       this.filterPortfolio.sort((a,b)=>(b.tranDate>a.tranDate)?1:-1);
       this.direction ="asc";
     }
  } 
  if(e=="pb")
   { 
     if(this.direction =="asc")
     {
       this.filterPortfolio.sort((a,b)=>(a.pb>b.pb)?1:-1);
       this.direction ="desc";
     }  
     else 
     {
       this.filterPortfolio.sort((a,b)=>(b.pb>a.pb)?1:-1);
       this.direction ="asc";
     }
  }
  if(e=="mc")
   { 
     if(this.direction =="asc")
     {
       this.filterPortfolio.sort((a,b)=>(a.mv>b.mv)?1:-1);
       this.direction ="desc";
     }  
     else 
     {
       this.filterPortfolio.sort((a,b)=>(b.mv>a.mv)?1:-1);
       this.direction ="asc";
     }
  } 
  }
  selectInvstOption(e: string): void   
  {
    this.yearEqt.length=0;
    this.invstEqt.length=0;
    this.invstMF.length=0;
    this.yearMF.length=0;
    this.yearDebt.length=0;
    this.invstDebt.length=0;
     if(e=="m")
     {
      this._eqTransaction.getYearlyInvestment("Monthly")
      .subscribe(data =>{
        data.forEach(element => {
           
          if(element.assettype==1)
            {
              this.yearEqt.push(element.year+"-"+element.qtr);
              this.invstEqt.push(element.investment.toFixed(2));
            }
            if(element.assettype==2)
            {
              this.yearMF.push(element.year+"-"+element.qtr)
              this.invstMF.push(element.investment.toFixed(2));
            }
            if(element.assettype==5)
            {
              this.yearDebt.push(element.year+"-"+element.qtr)
              this.invstDebt.push(element.investment.toFixed(2));
            }
        });
        this.yearEqt.reverse();
        this.invstEqt.reverse();
        this.invstMF.reverse();
        this.yearMF.reverse();
        this.yearDebt.reverse();
        this.invstDebt.reverse();
      });  
     }
     else{
      this._eqTransaction.getYearlyInvestment("Yearly")
      .subscribe(data =>{
        data.forEach(element => {
           
          if(element.assettype==1)
            {
              this.yearEqt.push(element.year)
               
              this.invstEqt.push(element.investment.toFixed(2));
            }
            if(element.assettype==2)
            {
              this.yearMF.push(element.year)
              this.invstMF.push(element.investment.toFixed(2));
            }
            if(element.assettype==5)
            {
              this.yearDebt.push(element.year)
              this.invstDebt.push(element.investment.toFixed(2));
            }
        });
        this.yearEqt.reverse();
        this.invstEqt.reverse();
        this.invstMF.reverse();
        this.yearMF.reverse();
        this.yearDebt.reverse();
        this.invstDebt.reverse();
      }); 
     }
     
  }
  SelectAssetType(e: string): void   
  {            
        //this.isMF = !this.isMF;
        this.isShare=!this.isShare;
       // console.log(this.isShare);
        if(this.isShare)
          this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===1);
        else  
          this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===2 ||s.assetType===5 );

          //console.log(this.filterPortfolio );
  }
   //.................... Shares Investment........................
   public barChartOptions: ChartOptions = {
    responsive: true,    
  };
  public barChartLabels: Label[] = this.yearEqt.reverse(); 
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    { backgroundColor: '#CE476B' },
    { backgroundColor: '#08b100db' },
    { backgroundColor: '#2AA7BC' },
          
  ]
  public invstShrDataSet: ChartDataSets[] = [
    { data:this.invstDebt, label: 'Investment in Debt MF' },
    { data:this.invstMF, label: 'Investment in Eqty MF' },   
    { data:this.invstEqt, label: 'Investment in Shares'  },
    
    
  ];

   //.................... MF Investment........................
  /* public barChartOptions1: ChartOptions = {
    responsive: true,    
  };

  public barChartLabels1: Label[] = this.yearMF; 
  public barChartType1: ChartType = 'bar';
  public barChartLegend1 = true;
  public barChartPlugins1 = [];
  public barChartColors1: Color[] = [
    { backgroundColor: '#D3BF8D' },
    { backgroundColor: '#08b100db' },     
  ]
  public invstMFDataSet: ChartDataSets[] = [
    { data:this.invstMF, label: 'Investment in Eqty MF',stack:'a' }
     
  ];
  //.................... Debt Investment........................
  public barChartOptions2: ChartOptions = {
    responsive: true,    
  };

  public barChartLabels2: Label[] = this.yearDebt; 
  public barChartType2: ChartType = 'bar';
  public barChartLegend2 = true;
  public barChartPlugins2 = [];
  public barChartColors2: Color[] = [ 
    { backgroundColor: '#889BB8' },
    { backgroundColor: '#D7E2E8' },     
  ]
  public invstDebtDataSet: ChartDataSets[] = [
    { data:this.invstDebt, label: 'Investment in Debt MF',stack:'a' }
     
  ];*/
//--------------------Investment vs intrest data -----------------------
public ChartOptions: ChartOptions = {
  responsive: true,
};
public ChartLabels: Label[] = this.year; 
public ChartType: ChartType = 'bar';
public ChartLegend = true;
public ChartPlugins = [];
public ChartColors: Color[] = [
  { backgroundColor: 'skyblue ' },
  { backgroundColor: '#08b100db' },     
]

public invstVsintrestData: ChartDataSets[] = [
  { data:this.invstmnt, label: 'Investment',stack:'a' },        
  { data:this.intrest, label: 'Intrest',stack:'a' },   
  
];
}
