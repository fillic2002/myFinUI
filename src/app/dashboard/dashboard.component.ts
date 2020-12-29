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
  constructor(private _dashbrd:SharesService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this._dashbrd.getDashBoard()
    .subscribe(data=>this.dbDetail = data);
  }

}
