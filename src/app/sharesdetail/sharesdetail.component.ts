import { Component, OnInit } from '@angular/core';
import { SharesService } from '../shares.service';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-sharesdetail',
  templateUrl: './sharesdetail.component.html',
  styleUrls: ['./sharesdetail.component.css']
})
export class SharesdetailComponent implements OnInit {

  public opt;
  public sh = [] as any;
  constructor(private _sharesDetail:SharesService,private route:ActivatedRoute) {  }

  ngOnInit( ) {
   
    let opts =this.route.snapshot.paramMap.get('id');
    this.opt=opts;
    console.log(this.opt)
    this.sh = this._sharesDetail.getShares();
  }

}
