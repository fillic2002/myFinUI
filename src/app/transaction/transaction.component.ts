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

}
