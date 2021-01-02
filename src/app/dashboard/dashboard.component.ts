import { Component, OnInit } from '@angular/core';
import { SharesService } from '../shares.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
  
})
export class DashboardComponent implements OnInit {

  public dbDetail = [] as any;
  public bankAmt: any;
  public total: any;
  constructor(private _dashbrd:SharesService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this._dashbrd.getDashBoard()
    .subscribe(data=>this.dbDetail = data);

    this._dashbrd.getBankAcTotal()
    .subscribe(data => this.bankAmt = data);

  }
  showTotal():void{
    var to:number;
    to=0;
    for (var i = 0; i < this.dbDetail.length; i++) {
       to= to + parseFloat(this.dbDetail[i].total);       
    }
    console.log(Number(this.bankAmt.amt));
    to= to + Number(this.bankAmt.amt);
    this.total=to.toFixed(2);
}

}
