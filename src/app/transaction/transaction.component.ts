import { Component, OnInit } from '@angular/core';
import { SharesService } from '../shares.service';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  public equitytransaction =[] as any;
  constructor(private _eqTransaction:SharesService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this._eqTransaction.getTransaction()
    .subscribe(data => this.equitytransaction = data);
  }

  AddTransaction():void  {

    //alert(document.getElementById('txtname'));
   this._eqTransaction.postTransaction(document.getElementById('txtPrice'),
   document.getElementById('txtName'),
   document.getElementById('txtQty'),
   document.getElementById('txtDt')
   
   )
    .subscribe(data => {
                         console.log(data);
                         
    })
  }
  add(){ 
    /*let row = document.createElement('div');   
      row.className = 'row'; 
      row.innerHTML = '<div class="addtran"><div>Name:</div><input id="txtname" type="text"><div>Quantity:</div><input id="txtQty" type="text"><div>Price:</div><input id="txtPrice" type="text"><div>Date:</div><input id="txtDt" type="date"><input type="button" value="Save" (click)="AddTransaction()"></div>';        
      const menu=document.querySelector('.AddTransaction')?.appendChild(row);*/
      alert("asd");
  } 
}
