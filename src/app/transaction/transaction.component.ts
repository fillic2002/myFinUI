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

  public equitytransaction =[] as any;
  public folio =[] as any;
  public status!: string;
  public total:any;
  public selectedLevel:any;
  public selectedfolio: any;
  public purchaseOption: any="B";
  isShown: boolean = true;
  public assetType!: Number;
  public assetId: any;

  constructor(private _eqTransaction:SharesService,private route:ActivatedRoute,private  router:Router) { }

  ngOnInit(): void {
    this._eqTransaction.getTransaction(this.selectedfolio)
    .subscribe(data =>{
     this.equitytransaction = data
     var to:number;
     to=0;
     for (var i = 0; i < this.equitytransaction.length; i++) {
       to= to + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
     }
     this.total=to.toFixed(2);
     
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
     console.log( this.selectedfolio);
   this._eqTransaction.postTransaction(
   document.getElementById('txtPrice'),
   this.assetId,
   document.getElementById('txtQty'),
   document.getElementById('txtDt'),
   this.selectedfolio,
   this.purchaseOption,
   this.assetType
   )
    .subscribe(data => {
      var status= document.getElementById('status')
    // this.status="Record added Successfully: "+ document.getElementById('txtQty').value +" of "+document.getElementById('txtName').value;
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
  selected(){
    console.log(this.selectedLevel)
  }
  changeFolio(e :any) {
    this.selectedfolio=e.target.value;
    this._eqTransaction.getTransaction(e.target.value)
    .subscribe(data =>{

     this.equitytransaction = data
     var to:number;
     to=0;
     for (var i = 0; i < this.equitytransaction.length; i++) {
       to= to + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
     }
     this.total=to.toFixed(2);
    });
  }
  selectOption(e:any)
  {
    this.purchaseOption = e.target.value;
  }
  changeAsset(e:any)
  {
    this.assetType =e.target.value;
     if(e.target.value==12)
      {
        console.log(e.target.value);        
        this.isShown = ! this.isShown;
      }
     else
     {
       this.isShown =true;
     }
  }
}
