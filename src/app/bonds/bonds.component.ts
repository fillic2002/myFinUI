import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from '@syncfusion/ej2-angular-charts';
import { SharesService } from '../shares.service';
import { CommonFunctions } from '../common/equitysearch/CommonFunctions';


@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.css']
})

export class BondsComponent implements OnInit {

  selectedfolio:number=0;
  selectedMonth:number=0;

  bondDetails=[] as any[];
  bondHoldings=[] as any[];
  bondTransaction=[] as any[];
  filterTransaction=[] as any[];
  public bondIntrestDetails=[] as any;
  public filteredIntrest=[] as any;
  public bondIntrestYearWise=[] as any;
  public monthlyBondIntrst=[] as any;
  public year=[] as any;
  public month=[] as any;
  response!: string;
  public divBondTransaction:boolean = false;
  showContainer: number = 1; 
  
  totalInvst:number=0;
  direction:string="asc";
  bName:string="";
  intrest:string="";
  folios=[] as any;
  totalBondIntrest:number=0;
  selectedYear:number=new Date().getFullYear();
  public show:boolean = false;
  public bondIntrest:boolean = false;  
  public bondMasterListFlag:boolean = false;
  
  public bondHoldingflag:boolean= true;
  public bondTranFlag:boolean=false;
  public buttonName:any = 'Show'; 
  public trnStatus:string='Add >' 

  constructor(private _shrdServ:SharesService,private router:Router,public commonFunctions: CommonFunctions) { }
  ngOnInit(): void {
     this._shrdServ.getBondDetails(this.selectedfolio,'0')
     .subscribe(data =>{ 
        this.bondDetails=data;
      });
     this.GetNetBondPurchsed();
     this.GetFolioDetails();
     this.GetBondHoldings();     
     this.getYearlyBondIntrest();
     this.getBondIntrest(this.selectedYear.toString());
     this.getYearlyIntrest(new Date().getFullYear().toString());
  }
  
  GetNetBondPurchsed(){
    this._shrdServ.getBondTransaction(this.selectedfolio)
      .subscribe(data =>{  
        //debugger;
        this.bondTransaction =data;
        this.filterTransaction =data;
        data.forEach(element => {
          if(new Date(element.bondDetail.dateOfMaturity) >= new Date())
          {
            this.totalInvst += element.qty*element.invstPrice;           
          }
        });
      }); 
      
      console.log(this.bondTransaction);
  }
  GetBondHoldings(){
    this._shrdServ.getBondHoldings(this.selectedfolio,this.selectedfolio)
      .subscribe(data =>{ 
        this.bondHoldings =data;               
      }); 
  }
  toggleContainer(containerNumber: number): void {
    this.showContainer = containerNumber;
  }
  updateBondDetails(bondObj: any) {
    debugger;
    if(this.intrest != null)
      {
        bondObj.intrestCycle = this.intrest;
      }    
    this._shrdServ.updateBondDetails( bondObj)
    .subscribe(data =>{ 
       this.response ="Bond Detail updated successfully for::"+ bondObj.bondName;
    });
  }
  public SearchBond( bnd: any){  
    debugger;
    this.bondMasterListFlag = true;
    //this.bondIntrest = false;

    this._shrdServ.searchBond(bnd)
      .subscribe(data =>{ 
        this.bondDetails =data;        
      });
  } 
  public selectnext(option:any){    
    this.router.navigate(['/admin']);  
  }
  
  public deleterecord(bondId:any,purchaseDate:any,qty:any,ID:any)
  {
     
    if(confirm("Are you sure to delete ")) {        
    this._shrdServ.deleteBondTransaction(bondId, ID, purchaseDate)
      .subscribe(data =>{
        this.result = data;
      });
   }
   
   this.GetNetBondPurchsed(); 
  }
  public getTranMaturityColor(dateOfMaturity:Date):string
  { 
    let currentDate:Date= new Date();
    let md:Date= new Date(dateOfMaturity.toString());

    if( md<currentDate)
          return 'red';
    else
      return 'black'
  }
  public getTranTypeColor(x:any):string
  {   
    if(x=='1'|| x=="true")
          return '#22a704';
    else
      return '#ff0000e0'
  }  
  sort(e:string) {   
    //debugger;
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
    }else if(e=="maturityPurchase")
    { 
      if(this.direction =="asc")
      {        
       this.bondTransaction.sort((a,b)=>(a.bondDetail.dateOfMaturity>b.bondDetail.dateOfMaturity)?1:-1);       
        this.direction ="desc";
      }
      else  
      {
       this.bondTransaction.sort((a,b)=>(b.bondDetail.dateOfMaturity>a.bondDetail.dateOfMaturity)?1:-1);       
        this.direction ="asc"; 
      }
   }
   else if(e=="purchaseDate")
    { 
      //console.log(this.filterTransaction);
      if(this.direction =="asc")
      {        
       this.filterTransaction.sort((a,b)=>(a.purchaseDate>b.purchaseDate)?1:-1);       
        this.direction ="desc";
      }
      else  
      {
       this.filterTransaction.sort((a,b)=>(b.purchaseDate>a.purchaseDate)?1:-1);       
        this.direction ="asc"; 
      }
   }
   else if(e=="maturityDate")
     { 
       if(this.direction =="asc")
       {        
        this.bondHoldings.sort((a,b)=>(a.bondDetail.dateOfMaturity>b.bondDetail.dateOfMaturity)?1:-1);       
         this.direction ="desc";
       }
       else  
       {
        this.bondHoldings.sort((a,b)=>(b.bondDetail.dateOfMaturity>a.bondDetail.dateOfMaturity)?1:-1);       
         this.direction ="asc"; 
       }
    }
    else if(e=="intrestPaymentDate")
     { 
       if(this.direction =="asc")
       {        
        this.filteredIntrest.sort((a,b)=>(a.intrestPaymentDate>b.intrestPaymentDate)?1:-1);       
         this.direction ="desc";
       }
       else  
       {
        this.filteredIntrest.sort((a,b)=>(b.intrestPaymentDate>a.intrestPaymentDate)?1:-1);       
         this.direction ="asc"; 
       }
    }
    else if(e=="trandt"){
      if(this.direction =="asc")
        {        
         this.bondTransaction.sort((a,b)=>(a.purchaseDate>b.purchaseDate)?1:-1);       
          this.direction ="desc";
        }
        else  
        {
         this.bondTransaction.sort((a,b)=>(b.purchaseDate>a.purchaseDate)?1:-1);       
          this.direction ="asc"; 
        }
        console.log(this.bondTransaction);
    }
  }
  onChange(field:any,event:any)
  {
    //debugger;
    this.intrest = event.target.innerText;
   
  }
  showIntrest(bondId:string)
  {
    (document.getElementById('bondDetail')as HTMLDivElement).style.display='block';
     
  }
  hideBondDetails()
  {
    (document.getElementById('bondDetail')as HTMLDivElement).style.display='none';    
  }
 GetFolioDetails()
{
  this._shrdServ.getAllfolio()
    .subscribe(data=>{
      this.folios =data;       
    }); 
 }
 changeFolio(e :any){ 
  this.totalInvst=0;
  this.selectedfolio=e.target.value;  
  this.filterTransaction =  this.bondTransaction.filter((s: { folioId: number; }) => s.folioId==this.selectedfolio); 
  this.filterTransaction.forEach(element => {
    if(new Date(element.bondDetail.dateOfMaturity) >= new Date())
    {
      this.totalInvst += element.qty*element.invstPrice;           
    }
  }); 
  debugger;
  this.GetBondHoldings();  
  this.filteredIntrest= this.bondIntrestDetails.filter((s: { folioId: number; intrestPaymentDate:string})=>s.folioId==this.selectedfolio  );
  
 }
 getBondDetail(bondId:any)
 {
  debugger;
    this.totalInvst=0;
    this.filterTransaction =  this.bondTransaction.filter((s: {
        bondDetail: any; bondId: number; 
      }) => s.bondDetail.bondId==bondId);  
      this.filterTransaction.forEach(element => {
        
        this.totalInvst += element.qty*element.invstPrice;           
      });
  }
  public showTrans() {
    this.show = !this.show;    
    if(this.show){ 
      this.buttonName = "^ Hide";
      this.trnStatus ='Hide';
    }
    else{
      this.buttonName = "Show";
      this.trnStatus ='Add >';
    }
  } 
  getBondIntrest(year:string)
  {  
    this.totalBondIntrest=0;
    this._shrdServ.getBondIntrest(year)
        .subscribe(data => { 
        this.bondIntrestDetails =data;
        this.filteredIntrest = data;
        
        (document.getElementById('cmpDivDetails')as HTMLDivElement).style.display='block'; 
        data.forEach(element => {
          this.totalBondIntrest+= element.amt;
        });
        });
  }
  moveId(bondId:string){
    (document.getElementById('bondId')as HTMLDivElement).value=bondId; 
  }
  getYearlyBondIntrest(){
    this.totalBondIntrest=0;

    this._shrdServ.getYearlyBondIntrest()
        .subscribe(data => {            
          data.forEach(element => {          
          this.year.push(element.year);
          this.bondIntrestYearWise.push(element.intrest);
        });
      });
  }
  AddBondTran()
  {
    // /debugger;
    var tranType =(document.getElementById('bondTranType')as  HTMLInputElement).value;
    var price = (document.getElementById('bondPurAmt') as  HTMLInputElement).value;    
    var bondID = (document.getElementById('bondId')as HTMLInputElement).value;    
    //var coupon = (document.getElementById('coupon')as HTMLInputElement).value;
    var qty = (document.getElementById('bondPurQty')as HTMLInputElement).value;
    var dt = (document.getElementById('bondPurchaseDt')as HTMLInputElement).value;

    this._shrdServ.postTransaction(price,bondID,qty,dt,this.selectedfolio,tranType,9,0,0)
    .subscribe(data => {
        this.response="New Transaction added to the database.";
    });
    this.router.navigateByUrl('/bonds');
  }

  Validated(item: any )
  {    
    this._shrdServ.updateBondPaymentDetails(item, true )
    .subscribe(data =>{ 
  
      if(data==true)
      {
        this.trnStatus ="Transaction validated successfully for "+ item.bondDetail.bondId +" & amount:"+ item.intrestAmt+" !";
        setTimeout(() => {
          this.trnStatus ="";
        }, 5000);        
      }
    });
    this.ngOnInit();
  }
   
  //-------------------Bond Intrest -----------------------------------------
public bondChartOption: ChartOptions = { 
  responsive: true,
};

public bondLbl: Label[] = this.year;  
public bondChartType: ChartType = 'bar';
public bondLegend = true;
public bondPlugin = [];
public bondColors: Array < any > = [
  { backgroundColor: '#A68E34',}
];
public BondData: ChartDataSets[] = [
  { data:this.bondIntrestYearWise, label: 'Yearly Intrest' },       
]; 
//-------------------------------------Monthly Bond Intrest------------------------------------
public mbondChartOption: ChartOptions = { 
  responsive: true,
};

public mbondLbl: Label[] = this.month;  
public mbondChartType: ChartType = 'bar';
public mbondLegend = true;
public mbondPlugin = [];
public mbondColors: Array < any > = [
  { backgroundColor: '#97CEEC',}
];
public mBondData: ChartDataSets[] = [
  { data:this.monthlyBondIntrst, label: 'Monthly Intrest' },       
]; 
//-------------------------------------------------------------------------
public yearSelected(e: any): void {   
  this.month.length=0;
  this.monthlyBondIntrst.length=0;
  if (e.event.type == "click") {
    const clickedIndex = e.active[0]?.index; 
      var lbl=e.active[0]._chart.getElementAtEvent(event)[0]._model.label;    
      
      this.selectedYear=lbl;
      this.getYearlyIntrest(lbl);
      
  }
  this.getBondIntrest(this.selectedYear.toString());
}
public getYearlyIntrest(year:string)
{
  this._shrdServ.getMonthlyBondIntrest(year)
  .subscribe(data => { 
    data.forEach(element => {
    this.month.push(element.month);
    this.monthlyBondIntrst.push(element.intrest.toFixed(2));
  });
});
}
public monthSelected(e: any): void {   
  this.month.length=0;
   debugger;
 this.bondIntrest = true; 
  this.totalBondIntrest =0;
  if (e.event.type == "click") {
    const clickedIndex = e.active[0]?.index; 
      var lbl=e.active[0]._chart.getElementAtEvent(event)[0]._model.label;          
      //this.selectedYear=lbl;
      this.selectedMonth = lbl; 
      //debugger;

      
      this.filteredIntrest = this.bondIntrestDetails.filter(item => {
        return new Date(Date.parse(item.intrestPaymentDate)).getMonth() + 1 === parseInt(lbl) 
    });
      if(this.selectedfolio>0)
      {
        this.filteredIntrest=this.filteredIntrest.filter((s: { folioId: number })=> s.folioId == this.selectedfolio );
      }       
      
      this.filteredIntrest.forEach(element => {
        this.totalBondIntrest+= element.intrestAmt;
      }); 
    }
}
  

}
