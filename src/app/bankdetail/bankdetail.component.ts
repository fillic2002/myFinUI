import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../shares.service';

@Component({
  selector: 'app-bankdetail',
  templateUrl: './bankdetail.component.html',
  styleUrls: ['./bankdetail.component.css']
})

export class BankdetailComponent implements OnInit {

  public accDetail =[] as any;

  constructor(private _acct:SharesService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this._acct.getBankAcDetails()
    .subscribe(data => this.accDetail = data);
  }
  AddTransaction():void  {

    //alert(document.getElementById('txtname'));
   this._acct.postAcTransaction(
    document.getElementById('txtUserId'),
     document.getElementById('txtId'),
     document.getElementById('txtRoi'),
     document.getElementById('txtAmt'),
     document.getElementById('txtDt')
   
   )
    .subscribe(data => {
     // var status= document.getElementById('status')
      //status=data;
                         
    })    
  }

}
