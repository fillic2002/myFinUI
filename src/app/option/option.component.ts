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
    { "name":"Shares","id":2}, 
    {"name":"Tax","id":3},
    {"name":"Liquid Asset","id":4}
  ]
  constructor(private  router:Router) {
    
  }

  ngOnInit(): void {
  }

  public onSelect(option:any)
  {    
    console.log("cliecked")
    this.router.navigate(['/option',option.id])
  }
}
