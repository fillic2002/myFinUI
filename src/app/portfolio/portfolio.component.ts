import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SharesService } from '../shares.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  public portfolio =[] as any;
  
  constructor(private _portfolio:SharesService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    
     this._portfolio.getPortfolio()
     .subscribe(data => this.portfolio = data);
  }

}
