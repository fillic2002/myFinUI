import {Component, HostListener, Input} from '@angular/core'; 
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

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
        console.log(this.sortDirection);
    }

    ngOnInit() { }

    public barChartOptions: ChartOptions = {
      responsive: true,
    };
    public lineChartLabels: Label[] = ['2015', '2016', '2017', '2018', '2019', '2020'];
    public barChartType: ChartType = 'line';
    public barChartLegend = true;
    public barChartPlugins = [];
    
    public lineChartData: ChartDataSets[] = [
      { data: [65, 67, 70, 75, 80, 90], label: 'PHP' },
      { data: [50, 48, 47, 49, 44, 40], label: '.Net' },
    ];
 

}

 
