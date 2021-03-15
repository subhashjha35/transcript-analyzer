import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() pieChartData: number[] = [0.5, 0.5];
  
  public pieChartOptions: ChartOptions = {
    responsive: false,
    animation: {
      duration: 0
    },
    tooltips: {
      enabled: false
    }
  };
  
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = false;
  public pieChartPlugins = [];

  constructor() { }

  ngOnInit() {
  }

}
