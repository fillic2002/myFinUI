import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit {

 
  public options=[
    {"name":"Dashboard","id":1},
    {"name":"Portfolio","id":2}, 
    {"name":"Investment","id":4},
    {"name":"Taxcompu","id":3},
    {"name":"BankAcDetail","id":5},
    {"name":"Bonds","id":8},
    {"name":"Expense","id":7},
    {"name":"Admin","id":6}

  ]
  constructor(private  router:Router) {
    
  }

  ngOnInit(): void {
  }
  
  
  public onSelect(option:any)
  {    
    if(option.id==1){this.router.navigate(['/dashboard'])}
    if(option.id==2){this.router.navigate(['/portfolio'])}
    if(option.id==4){this.router.navigate(['/transaction'])}
    if(option.id==3){this.router.navigate(['/tax'])}
    if(option.id==5){this.router.navigate(['/bankdetail'])}
    if(option.id==6){this.router.navigate(['/admin'])}
    if(option.id==7){this.router.navigate(['/expense'])}
    if(option.id==8){this.router.navigate(['/bonds'])}
  }
}
