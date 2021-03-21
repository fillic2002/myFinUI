import {Component, HostListener, Input} from '@angular/core'; 
@Component({
  selector: 'taxcompu',
  templateUrl: './taxcompu.component.html',
  styleUrls: ['./taxcompu.component.css'],
})
export class TaxcompuComponent {  
  rows:any[] = [
    {
      "ID" : "1",
      "Name" : "Rahul",
      "Age" : "21",
      "Gender" : "Male",
      "Country" : "India"
    },    
    {
      "ID" : "2",
      "Name" : "Ajay",
      "Age" : "25",
      "Gender" : "Male",
      "Country" : "India"
    }];

   
    @Input('sortable-column')
    columnName: string | undefined;

    @Input('sort-direction')
    sortDirection: string = '';

    @HostListener('click')
    sort() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    ngOnInit() { }

  
 

}

 
