import { Injectable } from '@angular/core';
import moment from 'moment';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  public nDaysForNewConsultation: number = 3;
  public letterHeadImgUrl: string = 'assets/images/letterHead/ambition_hospital.jpg';
  public dockColor: string = '#19212C'
  public ModulesConstData: any[] = [
    { imageSource: 'assets/images/master.png', altText: 'Master Image', title: 'Master', description: 'Master Description', tags: [], clicked: '' },
    { imageSource: 'assets/images/transaction.png', altText: 'Transaction Image', title: 'Transaction', description: 'Transaction Description', tags: [], clicked: '' },
    { imageSource: 'assets/images/report.png', altText: 'Report Image', title: 'Report', description: 'Report Description', tags: [], clicked: '' },
  ];
  public guardiansList: any[] = [
    { 'key': 'Daughter', 'value': 'Daughter' },
    { 'key': 'Daughter-in-law', 'value': 'Daughter-in-law' },
    { 'key': 'Father', 'value': 'Father' },
    { 'key': 'Grand Father', 'value': 'Grand Father' },
    { 'key': 'Grand Mother', 'value': 'Grand Mother' },
    { 'key': 'Husband', 'value': 'Husband' },
    { 'key': 'Wife', 'value': 'Wife' },
    { 'key': 'Mother', 'value': 'Mother' },
    { 'key': 'Son', 'value': 'Son' },
    { 'key': 'Son-in-law', 'value': 'Son-in-law' },
    { 'key': 'Other', 'value': 'Other' }
  ];
  public userType: any[] = [
    { 'key': 1, 'value': 'Internal' },
    { 'key': 2, 'value': 'External' }
  ]

  public maritalStatusList: any[] = [
    { 'key': 'Single', 'value': 'Single' },
    { 'key': 'Married', 'value': 'Married' },
    { 'key': 'Divorcee', 'value': 'Divorcee' },
    { 'key': 'Widow', 'value': 'Widow' }
  ];
  public paymentTypeList: any[] = [
    { 'key': 'Bank Transfer', 'value': 'Bank Transfer' },
    { 'key': 'Credit Card', 'value': 'Credit Card' },
    { 'key': 'Debit Card', 'value': 'Debit Card' },
    { 'key': 'IMPS', 'value': 'IMPS' },
    { 'key': 'NEFT', 'value': 'NEFT' },
    { 'key': 'RTGS', 'value': 'RTGS' },
    { 'key': 'UPI', 'value': 'UPI' }
  ];
  public bloodGroupList: any[] = [
    { 'key': 'A+', 'value': 'A+' },
    { 'key': 'A-', 'value': 'A-' },
    { 'key': 'AB+', 'value': 'AB+' },
    { 'key': 'AB-', 'value': 'AB-' },
    { 'key': 'B+', 'value': 'B+' },
    { 'key': 'B-', 'value': 'B-' },
    { 'key': 'O+', 'value': 'O+' },
    { 'key': 'O-', 'value': 'O-' },
    { 'key': 'Not Known', 'value': 'Not Known' },
  ];
  public religionList: any[] = [
    { 'key': 'Baudh', 'value': 'Baudh' },
    { 'key': 'Christian', 'value': 'Christian' },
    { 'key': 'Hindu', 'value': 'Hindu' },
    { 'key': 'Islam', 'value': 'Islam' },
    { 'key': 'Other', 'value': 'Other' },
    { 'key': 'Parsi', 'value': 'Parsi' },
    { 'key': 'Soutaal/Santal', 'value': 'Soutaal/Santal' },
    { 'key': 'Yahudi', 'value': 'Yahudi' }
  ];
  public documentsList: any[] = [
    { 'key': 'Aadhar Card', 'value': 'Aadhar Card' },
    { 'key': 'ABHA Card', 'value': 'ABHA Card' },
    { 'key': 'Driving Liscence', 'value': 'Driving Liscence' },
    { 'key': 'Pan Card', 'value': 'Pan Card' },
    { 'key': 'PM-JAY Card', 'value': 'PM-JAY Card' }
  ];
  public consultationList: any[] = [
    { 'key': '1', value: 'First Time Consultation' },
    { 'key': '2', value: 'Follow Up Consultation' }
  ];
  public paymentModes: any[] = [
    { 'key': '1', 'value': 'Cash' },
    { 'key': '2', 'value': 'Cheque' },
    { 'key': '3', 'value': 'Online' },
  ];
  public calculateAge(dob: Moment) {
    const now = moment();
    const duration = moment.duration(now.diff(dob));

    const years = duration.years();
    const months = duration.months();
    const days = duration.days();

    let ageString = '';

    if (years > 0) {
      ageString += years + ' years ';
    }
    if (months > 0) {
      ageString += months + ' months ';
    }
    if (days > 0) {
      ageString += days + ' days ';
    }
    ageString = ageString.trim();

    return ageString;
  }
  constructor() { }
}