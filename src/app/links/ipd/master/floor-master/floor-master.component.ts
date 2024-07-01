import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AddFloorModel, FloorData, FloorMasterService } from './floor-master.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, NgForm } from '@angular/forms';
import { TextFieldComponent } from '../../../../shared/inputs/text-field/text-field.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-floor-master',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    MatTooltipModule,
    FormsModule,
    TextFieldComponent,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './floor-master.component.html',
  styleUrl: './floor-master.component.scss'
})
export class FloorMasterComponent {
  constructor(private title: Title, private service: FloorMasterService) {title.setTitle('Floor Master');}

  public ELEMENT_DATA: FloorData[] = [];
  public dataSource = new MatTableDataSource<FloorData>(this.ELEMENT_DATA);
  public showFloors: boolean = true;
  public addingFloor: boolean = false;
  public displayedColumns: string[] = ['row', 'floorName', 'createdBy', 'actions'];
  public floorName: string = '';
  public loading = {
    resetting: false,
    submitting: false
  }
  public openDialog:boolean = false;
  public action:string = '';
  public changeFloorId:number = 0;

  async ngOnInit(): Promise<void> {

    const tableData = await this.service.getAllFloors();
    let rn = 1;
    tableData.forEach(x => {
      this.ELEMENT_DATA.push({ ...x, row: rn });
      rn++;
    });
    this.dataSource = new MatTableDataSource<FloorData>(this.ELEMENT_DATA);
  }

  public FloorsList() {
    this.showFloors = !this.showFloors;
    this.addingFloor = false;
  }
  public formToAddNewFloor() {
    this.showFloors = !this.showFloors;
    this.addingFloor = true;
  }

  public async addFloor(form: NgForm) {
    this.loading.submitting = true;
    if (form.valid) {
      const data: AddFloorModel = {
        Token: localStorage.getItem('token'),
        FloorName: form.value.FloorName
      }
      const status = await this.service.addFloor(data);
      alert(status.message);
      if (status.status === 1) {
        window.location.reload();
      }
    }
    else {
      alert('Enter full details');
    }
    this.loading.submitting = false;
  }

  public floorDelete(floorId: number) {
    this.changeFloorId = floorId;
    this.action = 'Delete'
    this.openDialog = true;
  }
  public floorEdit(floorId: number) {
    this.changeFloorId = floorId;
    this.action = 'Edit'
    this.openDialog = true;
  }
}
