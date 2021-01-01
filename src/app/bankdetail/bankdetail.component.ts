import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bankdetail',
  templateUrl: './bankdetail.component.html',
  styleUrls: ['./bankdetail.component.css']
})
export class BankdetailComponent implements OnInit {

  constructor(private _acct:SharesService,private route:ActivatedRoute) { }

  ngOnInit(): void {
  }

}
