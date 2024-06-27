import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "../../../../login.service";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Injectable({
  providedIn: 'root'
})
export class OpdServiceService {
  constructor(private http: HttpClient, private lService: LoginService) { }
  private apiUrl = this.lService.__apiURL__;
  private token = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  });

  public async getnDaysPatients(nDays: number): Promise<opdObjectResponse[]> {
    return new Promise<opdObjectResponse[]>((resolve) => {
      const allPatients = this.http.get<opdResponse>(this.lService.__apiURL__ + "/OPD/GetNDaysOPDPatients", {
        headers: this.token, params: {
          'n': nDays
        }
      });

      allPatients.subscribe({
        next: (data) => {
          const patientsData: opdObjectResponse[] = data.nOPDPatients;
          resolve(patientsData);
        }
      });
    });
  }

  public async getAllServices(procedureName: string | null = null): Promise<dropDownResponse[]> {
    return new Promise<dropDownResponse[]>((resolve) => {
      const allServices = this.http.get<dropDownResponse[]>(this.lService.__apiURL__ + "/Service/GetAllServices", {
        headers: this.token, params: {
          procedureName: procedureName ?? ""
        }
      });

      allServices.subscribe({
        next: (data) => {
          resolve(data);
        }
      });
    });
  }

  public async getAllSubServices(serviceId: number, procName: string | null): Promise<dropDownResponse[]> {
    return new Promise<dropDownResponse[]>((resolve) => {
      const allSubServices = this.http.get<dropDownResponse[]>(this.lService.__apiURL__ + "/SubService/GetAllSubServices", {
        headers: this.token, params: {
          'serviceId': serviceId,
          'procName': procName ?? ''
        }
      });

      allSubServices.subscribe({
        next: (data) => {
          resolve(data);
        }
      });
    });
  }

  public async loadPatientsDetails(opid: string): Promise<PatientDetails> {
    return new Promise<PatientDetails>((resolve) => {
      const patient = this.http.get<PatientDetails>(this.lService.__apiURL__ + "/OPD/GetPatientDetailsByOpid", {
        headers: this.token, params: {
          'opid': opid
        }
      });

      patient.subscribe({
        next: (data) => {
          resolve(data);
        }
      });
    });
  }

  public getProcedures(startWith: string): Promise<string[]> {
    const toSend = new Promise<string[]>(resolve => {

      if (startWith === '') {
        resolve([]);
      }

      const data = this.http.get<procedureResponse>(this.apiUrl + '/Procedure/getProcedureStartsWith', {
        headers: this.token, params: {
          'startsWith': startWith
        }
      });

      data.subscribe({
        next: (response) => {
          resolve(response.procedures);
        }
      })
    });

    return toSend;
  }

  public procedureIsValid(procedure: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const data = this.http.get<boolean>(this.apiUrl + '/Procedure/IsProcedureValid', {
        headers: this.token, params: {
          'procName': procedure
        }
      });

      data.subscribe({
        next: (response) => {
          resolve(response);
        },
        error: () => {
          resolve(false);
        }
      })
    });
  }

  public validateAdd(charge: ChargeSection, procedure: string | null, addedProceduresList: chargeSummaryResponse[]): boolean {
    if (procedure === null) {
      alert('Please enter Procedure');
      return false;
    }
    else if (addedProceduresList !== null && addedProceduresList.find(proc => proc.procedureName === procedure) != undefined) {
      alert('This Procedure already exists');
      return false;
    }
    else if (!this.procedureIsValid(procedure)) {
      alert('Please enter valid procedure');
      return false;
    }
    else if (charge.service === 0) {
      alert('Please enter Service');
      return false;
    }
    else if (charge.subService === 0) {
      alert('Please enter sub service');
      return false;
    }
    else if (charge.doctor === 0) {
      alert('Please enter doctor');
      return false;
    }
    else if (charge.quantity === 0) {
      alert('Quantity should be atleast one');
      return false;
    }
    else if (charge.charge === 0) {
      alert('Please enter some charging amount of service');
      return false;
    }
    return true;
  }

  public submitOpdService(opdService: opdServiceData, master: ChargeSection, child: MatTableDataSource<chargeSummaryResponse, MatPaginator>): Promise<void> {
    return new Promise<void>(() => {
      if (this.validateSubmit(master, child.data.length)) {
        console.log('Can Save');
        const masterData: opdServiceMaster = {
          Id: null,
          CreatedBy: null,
          CreatedOn: null,
          ModifiedBy: null,
          ModifiedOn: null,
          isActive: true,
          Uhid: opdService.uhid,
          Opid: opdService.opid,
          TotalAmount: master.totalAmount,
          TotalDiscount: master.totalDiscount,
          PaidAmount: master.paidAmount,
          ReferredBy: master.referredBy.toString() === '' ? 0 : master.referredBy,
          Remarks: master.remarks,
          PaymentMode: master.paymentMode,
          BankName: master.bankName,
          ChequeDate: master.chequeDate.value === '' ? null : master.chequeDate.value,
          ChequeAmount: master.chequeAmount,
          PaymentType: master.paymentType,
          CardNo: master.cardNo,
          ChequeNo: master.chequeNo,
          ReferenceNo: master.referenceNo,
          UpiId: master.UPIID
        }

        let childData: OpdServiceChild[] = [];
        child.data.forEach(x => {
          const tempChildData: OpdServiceChild = {
            Id: null,
            CreatedBy: null,
            CreatedOn: null,
            ModifiedBy: null,
            ModifiedOn: null,
            isActive: true,
            OpdServiceMasterId: null,
            ServiceId: x.serviceId,
            SubServiceId: x.subServiceId,
            ProcedureId: null,
            ProcedureName: x.procedureName,
            DoctorId: x.doctorId,
            Quantity: x.quantity,
            Charge: x.charge,
            DiscountInRs: x.discountRs
          }
          childData.push(tempChildData);
        });

        const sendData = this.http.post<number>(this.apiUrl + '/OPD/OpdServicePost',
          {
            master: masterData,
            child: childData,
            token: localStorage.getItem('token') ?? ''
          }, { headers: this.token });

        sendData.subscribe({
          next: (response) => {
            if (response > 1) {
              alert('Opd Service Posted Successfully');
              window.location.reload();
            }
            else if (response <= 0) {
              alert('Something went wrong');
            }
          },
          error: () => {
            alert('Something went wrong. Server Error');
          }
        })
      }
    });
  }

  public validateSubmit(x: ChargeSection, y: number): boolean {
    if (y === 0) {
      alert('Please enter some services to continue.');
      return false;
    }
    if (x.remarks.trim() === '') {
      alert('Please enter some remarks');
      return false;
    }
    if (x.paidAmount > 0) {
      if (x.paymentMode == 0) {
        alert('Enter Payment Mode');
        return false;
      }
      else if (x.paymentMode == 2) {
        if (x.bankName === 0) {
          alert('Please enter bank name');
          return false;
        }
        if (x.chequeDate === null) {
          alert('Please enter Cheque Date');
          return false;
        }
        if (x.chequeNo === '') {
          alert('Please enter Cheque Number');
          return false;
        }
        if (x.chequeAmount === null) {
          alert('Please enter Cheque Amount');
          return false;
        }
      }
      else if (x.paymentMode == 3) {
        if (x.paymentType !== 'UPI') {
          if (x.cardNo === '') {
            alert('Please enter card No.');
            return false;
          }
          if (x.bankName === 0) {
            alert('Please enter bank name');
            return false;
          }
          if (x.referenceNo === '') {
            alert('Please enter Reference Number');
            return false;
          }
        }
        else {
          if (x.UPIID === '') {
            alert('Please enter UPI ID');
            return false;
          }
          if (x.referenceNo === '') {
            alert('Please enter Reference Number');
            return false;
          }
        }
      }
    }
    return true;
  }
}

interface opdResponse {
  nOPDPatients: any[]
}

interface dropDownResponse {
  key: number;
  value: string;
}

interface procedureResponse {
  procedures: string[]
}

export interface PatientDetails {
  date: Date,
  uhid: string,
  opid: string,
  receiptNo: string,
  patientsName: string,
  age: string,
  departmentId: number,
  companyId: number,
  type: string, // Cash Patient, Cheque Patient or Online Patient
  doctorId: number
}

export interface opdObjectResponse {
  opid: string;
  uhid: string;
  patientsName: string;
  companyName: string;
  admissionDate: Date
}

export interface chargeSummaryResponse {
  row: number;
  serviceId: number;
  serviceName: string;
  subServiceId: number;
  subServiceName: string;
  procedureName: string;
  doctorId: number;
  doctorName: string;
  charge: number;
  quantity: number;
  discountRs: number;
  netCharge: number;
}

export interface ChargeSection {
  service: number;
  subService: number;
  doctor: number;
  quantity: number;
  charge: number;
  discountPercent: number;
  discountRs: number;
  netCharge: number;

  totalAmount: number;
  totalDiscount: number;
  totalCharge: number;
  paidAmount: number;
  balanceAmount: number;

  referredBy: number;
  remarks: string;

  paymentMode: number;
  bankName: number;
  chequeDate: FormControl;
  chequeNo: string;
  chequeAmount: number;
  paymentType: string;
  referenceNo: string;
  cardNo: string;
  UPIID: string;
}

export interface opdServiceData {
  date: FormControl,
  uhid: string,
  opid: string,
  receiptNo: string,
  patientName: string
  age: string,
  departmentId: number,
  companyId: number,
  type: string,
  doctorId: number
}

interface opdServiceMaster {
  Id: number | null,
  CreatedBy: number | null,
  CreatedOn: Date | null,
  ModifiedBy: number | null,
  ModifiedOn: Date | null,
  isActive: boolean,
  Uhid: string,
  Opid: string,
  TotalAmount: number,
  TotalDiscount: number,
  PaidAmount: number,
  ReferredBy: number,
  Remarks: string,
  PaymentMode: number,
  BankName: number,
  ChequeDate: Date,
  ChequeNo: string,
  ChequeAmount: number,
  PaymentType: string,
  CardNo: string,
  ReferenceNo: string,
  UpiId: string
}

interface OpdServiceChild {
  Id: number | null,
  CreatedBy: number | null,
  CreatedOn: Date | null,
  ModifiedBy: number | null,
  ModifiedOn: Date | null,
  isActive: boolean,
  OpdServiceMasterId: number | null,
  ServiceId: number,
  SubServiceId: number,
  ProcedureId: number | null,
  ProcedureName: string;
  DoctorId: number,
  Quantity: number,
  Charge: number,
  DiscountInRs: number
}