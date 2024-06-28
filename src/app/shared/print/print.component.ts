import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstantsService } from '../../constants.service';

@Component({
  selector: 'app-print',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './print.component.html',
  styleUrl: './print.component.scss'
})
export class PrintComponent implements OnInit {
  @Input() tableData!: any[];
  @Input() ReportName: string = '';
  public letterHeadUrl: string = this.constants.letterHeadImgUrl;

  constructor(private route: ActivatedRoute,private constants: ConstantsService) {}
  headers: string[] = [];

  ngOnInit() {
    const encodedData = localStorage.getItem('tableData');
    const reportName = localStorage.getItem('reportName');
    if(encodedData) {
      this.tableData = JSON.parse(decodeURIComponent(encodedData));
      this.headers = Object.keys(this.tableData[0]);
      print();
    }

    if(reportName) {
      this.ReportName = reportName;
    }
  }
}
