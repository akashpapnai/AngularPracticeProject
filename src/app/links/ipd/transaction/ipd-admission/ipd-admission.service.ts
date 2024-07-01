import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import moment from "moment";
import { LoginService } from "../../../../login.service";
import { UserData, countryResponse, patientDataResponse, uhidResponse } from "../../../opd/transaction/opdmanagement/interfaces";
import { ConstantsService } from "../../../../constants.service";
import { OpdManagementService } from "../../../opd/transaction/opdmanagement/opd-management.service";

@Injectable({
    providedIn: 'root'
})
export class IpdAdmissionService {

    constructor(private http: HttpClient, private opdMngmt: OpdManagementService, private lService: LoginService, private constants: ConstantsService) { }

    private token = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
    });

    public getUserType(): any[] { return this.constants.userType; }
    public getMaritalStatus(): any[] { return this.constants.maritalStatusList; }
    public getReligion(): any[] { return this.constants.religionList; }

    public async getWards(wardId: number | null): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            const wards = this.http.get<wardResponse>(this.lService.__apiURL__ + '/Ward/getAllWards', {headers: this.token, params: {
                wardId: wardId ?? 0
            }});
            wards.subscribe({
                next: (response) => {
                    resolve(response.allWards);
                },
                error: () => {
                    resolve([]);
                }
            })
        })
    }

    public async getBeds(wardId: number,bedId: number | null): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            const beds = this.http.get<bedResponse>(this.lService.__apiURL__ + '/Ward/getAllBeds', {headers: this.token, params: {
                wardId: wardId,
                bedId: bedId ?? 0
            }});
            beds.subscribe({
                next: (response) => {
                    resolve(response.allBeds);
                },
                error: () => {
                    resolve([]);
                }
            })
        })
    }

    public getAllCountries(): Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            const data = this.http.get<countryResponse>(this.lService.__apiURL__ + '/Common/getAllCountries', { headers: this.token });

            data.subscribe({
                next: (response) => {
                    resolve(response.allCountries)
                },
                error: () => {
                    resolve([]);
                }
            })
        })
    }

    public fillData(user: UserData, admissionClass: IpdAdmission) {
        admissionClass.Date = new FormControl({ value: user.Date, disabled: true });
        admissionClass.FirstName = user.FirstName;
        admissionClass.MiddleName = user.MiddleName;
        admissionClass.LastName = user.LastName;
        admissionClass.CountryId = user.CountryId;
        admissionClass.MaritalStatus = user.MaritalStatus;
        admissionClass.LocalAddress = user.LocalAddress;
        admissionClass.mobile = user.MobNumber;
        admissionClass.secMobile = user.SecMobNumber;
        admissionClass.email = user.Email;
        admissionClass.Religion = user.Religion;
        admissionClass.Age = this.constants.calculateAge(moment(user.DOB));
    }

    public getIpids(startWith: string): Promise<string[]> {
        return new Promise<string[]>(resolve => {

            if (startWith === '') {
                resolve([]);
            }

            const data = this.http.get<ipidResponse>(this.lService.__apiURL__ + '/IPD/getIpidStartsWith', {
                headers: this.token, params: {
                    'startsWith': startWith
                }
            });

            data.subscribe({
                next: (response) => {
                    resolve(response.ipids);
                }
            })
        });
    }
}

export const admissionData = {
    Date: new FormControl({ value: moment(), disabled: true }),
    AppointmentNo: "",
    Uhid: "",
    Ipid: "",
    UserType: 1,
    FirstName: "",
    MiddleName: "",
    LastName: "",
    GuardianName: "",
    Age: "",
    MaritalStatus: "0",
    Occupation: "",
    Religion: "0",
    LocalAddress: "",
    CountryId: "0",
    StateId: "0",
    CityId: "0",
    mobile: "",
    secMobile: "",
    email: "",
    company: 0,
    refLetterNo: "",
    idCardNo: "",
    department: 0,
    AdmittingDoc: 0,
    Ward: 0,
    Bed: 0,
    chargeableTariff: 0,
    TreatingDoc: 0,
    MLC: false,
    ReferredBy: 0,
    Type: 0,
    relativeData: []
}

interface wardResponse {
    allWards: any[];
}

interface bedResponse {
    allBeds: any[];
}

interface ipidResponse {
    ipids: string[]
}

export interface IpdAdmission {
    Date: FormControl,
    AppointmentNo: string,
    Uhid: string,
    Ipid: string,
    UserType: number,
    FirstName: string,
    MiddleName: string,
    LastName: string,
    GuardianName: string,
    Age: string,
    MaritalStatus: string,
    Occupation: string,
    Religion: string,
    LocalAddress: string,
    CountryId: string,
    StateId: string,
    CityId: string,
    mobile: string,
    secMobile: string,
    email: string,
    company: number,
    refLetterNo: string,
    idCardNo: string,
    department: number,
    AdmittingDoc: number,
    Ward: number,
    Bed: number,
    chargeableTariff: number,
    TreatingDoc: number,
    MLC: boolean,
    ReferredBy: number,
    Type: number,
    relativeData: relativesInfo[]
}

export interface relativesInfo {
    Name: string,
    realtionWithPatient: string,
    Address: string,
    Mobile: string
}