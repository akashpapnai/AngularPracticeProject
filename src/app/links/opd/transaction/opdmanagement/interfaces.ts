export interface uhidResponse {
 uhids: string[];
}

export interface opidResponse {
 opids: string[];
}

export interface latestOpidResponse{
 opid: string;
}

export interface countryResponse {
 allCountries: any[]
}
export interface statesResponse {
 allStates: any[]
}
export interface citiesResponse {
 allCities: any[]
}

export interface unitsResponse {
 allUnits: any[];
}

export interface companyResponse {
 allCompanies: any[]
}

export interface bankResponse {
 allBanks: any[]
}

export interface departmentResponse {
 allDepartments: any[]
}

export interface doctorResponse {
 allDoctors: any[];
}
export interface GotDepartment {
 department: number;
 consultationCharge: number
}
export interface consultChargeResponse {
 consultationCharge: number;
}
export interface consultationTypeResponse {
 whichConsultation: string;
}
export interface disApprovedByResponse {
 allAuthorizedEmployees: any[];
}
export interface submitResponse {
  status: number;
}
export interface chiefComplainsResponse {
 allComplains: any[];
}
export interface patientDataResponse {
 patientData: any;
}

export interface UserData {
 BloodGroup: string;
 CityId: string;
 CountryId: string;
 CreatedBy: Date;
 CreatedDate: Date;
 DOB: string;
 Date: string;
 DocumentNumber: string;
 DocumentType: string;
 Email: string;
 FirstName: string;
 Guardian: string;
 GuardianName: string;
 Id: number;
 LastName: string;
 LocalAddress: string;
 MaritalStatus: string;
 MiddleName: string;
 MobNumber: string;
 ModifiedBy: string | null;
 ModifiedDate: string | null;
 Occupation: string;
 PinCode: string;
 Religion: string;
 Salutation: string;
 SecMobNumber: string;
 StateId: string;
 Uhid: string;
 isActive: boolean;
}

export interface FinalData {
  Id: number;
  CreatedBy: number;
  CreatedDate: Date;
  ModifiedBy: number;
  ModifiedDate: Date;
  isActive: boolean;
  Date: Date;
  AppointmentNo: string;
  Uhid: string;
  Opid: string;
  Company: number;
  RefLetterNo: string;
  IdCardNo: string;
  Department: number;
  Unit: number;
  Doctor: number;
  ConsultationCharge: number;
  ReferredBy: number;
  DiscountAmount: number;
  DiscountApprovedBy: number;
  ChiefComplaints: number;
  PaidAmount: number;
  MLC: boolean;
  PaymentMode: number;
  BankName: number;
  ChequeDate: Date,
  ChequeNo: string;
  ChequeAmount: number;
  PaymentType: string;
  CardNo: string;
  ReferenceNo: string;
  UPIID: string;
}