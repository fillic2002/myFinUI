import { Directive,Input, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { utils } from 'protractor';
import {Sort} from '../util/sort';


@Directive({
  selector: '[appSort]'
})

export class SortDirective {
  collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  });
  


  @Input() appSort:Array<any>;
  constructor(private targetEle:ElementRef,private ren: Renderer2) { }
  
  @HostListener("click")
  sortData(){

    const sort = new Sort();
    const ele = this.targetEle.nativeElement;
    const ord = ele.getAttribute('data-order');
    const pro = ele.getAttribute('data-name');
    const type = ele.getAttribute('data-type');
    
    if(ord=="desc")
    {
      //sort(sort.startsort(ord,type,pro,));
      
      ele.setAttribute("data-order","asc");
      this.appSort.sort((a,b) => a.Name.localeCompare(b.Name));
      console.log("In the sort directve::"+ this.appSort[0].Name);
      
    }
    else
    {
      //this.appSort.sort(sort.startsort(ord,type,pro));
       
      ele.setAttribute("data-order","desc");
      this.appSort.sort((a,b) => a.Name.localeCompare(b.Name));


      console.log("In the sort directve::"+ this.appSort[0].Name);
    }    
     
  }

}
