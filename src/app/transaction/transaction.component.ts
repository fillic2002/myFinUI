import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../shares.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  public portfolio =[] as any;
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
  showresult: boolean = false ;
  qty: any;
  direction:string="asc";
  isMF:boolean=false;
  isShare:boolean=true;

  constructor(private _eqTransaction:SharesService,private route:ActivatedRoute,private  router:Router) { }

  ngOnInit(): void {
    this._eqTransaction.getTransaction(1)
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
  }
  AddTransaction():void  {
    if(document.getElementById('txtName') == null)
    {
      this.assetId =""
    }
    else{
      this.assetId = document.getElementById('txtName');
    }
    console.log(document.getElementById('txtQty'));
    this.qty = document.getElementById('txtQty');
    this.qty=this.qty.value.replace(',','');
    
    this._eqTransaction.postTransaction(document.getElementById('txtPrice'),
          this.assetId,
          this.qty,
          document.getElementById('txtDt'),
          this.selectedfolio,
          this.purchaseOption,
          this.assetType
      )
    .subscribe(data => {
     var status= document.getElementById('status')
     this.status="Record added Successfully: "+this.assetType +" of "+this.assetId.value;

     this.ngOnInit();      
    })
  }
  add(){ 
      this._eqTransaction.getAllfolio()
    .subscribe(datan =>{ 
      this.folio = datan;
    });
   
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
    //this.equitytransaction.length=0;
    this.selectedfolio=e.target.value;
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
    console.log(e);
    if(e=="ID")
    {
      if(this.direction =="asc")
      {
        this.equitytransaction.sort((a,b)=>(a.equityId>b.equityId)?1:-1);
        this.direction ="desc";
      }
      else 
      {
        this.equitytransaction.sort((a,b)=>(b.equityId>a.equityId)?1:-1);
        this.direction ="asc";
      }
   }
  }
  setradio(e: string): void   
  {            
        this.isMF = !this.isMF;
        this.isShare=!this.isShare;
        if(this.isShare)
          this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===1);
        else  
          this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===2 ||s.assetType===5 );
  }
}
