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
  public total: any;
  constructor(private _dashbrd:SharesService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this._dashbrd.getDashBoard()
    .subscribe(data=>this.dbDetail = data);

  }
  showTotal():void{
    var to:number;
    to=0;
    for (var i = 0; i < this.dbDetail.length; i++) {
      console.log(parseInt( this.dbDetail[i].total));
       to= to + parseFloat(this.dbDetail[i].total);
       
  }
  this.total=to.toFixed(2);
}

}
