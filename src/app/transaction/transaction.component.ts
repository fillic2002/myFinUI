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
  constructor(private _eqTransaction:SharesService,private route:ActivatedRoute,private  router:Router) { }

  ngOnInit(): void {
    this._eqTransaction.getTransaction()
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

    
   this._eqTransaction.postTransaction(
   document.getElementById('txtPrice'),
   document.getElementById('txtName'),
   document.getElementById('txtQty'),
   document.getElementById('txtDt'),
   1
   )
    .subscribe(data => {
     // var status= document.getElementById('status')
     //this.status="Record added Successfully: "+ document.getElementById('txtQty').value +" of "+document.getElementById('txtName').value;
     this.ngOnInit();      
    })

  }
  add(){ 
    /*let row = document.createElement('div');   
      row.className = 'row'; 
      row.innerHTML = '<div class="addtran"><div>Name:</div><input id="txtname" type="text"><div>Quantity:</div><input id="txtQty" type="text"><div>Price:</div><input id="txtPrice" type="text"><div>Date:</div><input id="txtDt" type="date"><input type="button" value="Save" (click)="AddTransaction()"></div>';        
      const menu=document.querySelector('.AddTransaction')?.appendChild(row);*/
     
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
}
