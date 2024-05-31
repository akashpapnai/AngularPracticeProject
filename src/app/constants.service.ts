import { Injectable } from '@angular/core';
import moment from 'moment';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  public letterHeadImgUrl: string = 'assets/images/letterHead/ambition_hospital.jpg';
  public dockColor: string = '#19212C'
  public ModulesConstData: any[] = [
    { imageSource: 'assets/images/master.png', altText: 'Master Image', title: 'Master', description: 'Master Description', tags: [], clicked: '' },
    { imageSource: 'assets/images/transaction.png', altText: 'Transaction Image', title: 'Transaction', description: 'Transaction Description', tags: [], clicked: '' },
    { imageSource: 'assets/images/report.png', altText: 'Report Image', title: 'Report', description: 'Report Description', tags: [], clicked: '' },
  ];
  public guardiansList: string[] = [
    'Daughter',
    'Daughter-in-law',
    'Father',
    'Grand Father',
    'Grand Mother',
    'Husband',
    'Wife',
    'Mother',
    'Son',
    'Son-in-law',
    'Other'
  ];
  public maritalStatusList: string[] = [
    'Single',
    'Married',
    'Divorcee',
    'Widow'
  ];
  public bloodGroupList: string[] = [
    'A+',
    'A-',
    'AB+',
    'AB-',
    'B+',
    'B-',
    'O+',
    'O-',
    'Not Known'
  ];
  public religionList: any[] = [
    {'key':'Baudh','value':'Baudh'},
    {'key':'Christian', 'value':'Christian'},
    {'key':'Hindu', 'value':'Hindu'},
    {'key':'Islam', 'value':'Islam'},
    {'key':'Other', 'value':'Other'},
    {'key':'Parsi', 'value':'Parsi'},
    {'key':'Soutaal/Santal', 'value':'Soutaal/Santal'},
    {'key':'Yahudi', 'value':'Yahudi'}
  ];
  public documentsList: string[] = [
    'Aadhar Card',
    'ABHA Card',
    'Driving Liscence',
    'Pan Card',
    'PM-JAY Card'
  ];
  public consultationList: any[] = [
    {'key':'1', value: 'First Time Consultation'},
    {'key':'2', value: 'Follow Up Consultation'}
  ];
  public paymentModes: any[] = [
    {'key':'1', 'value':'Cash'},
    {'key':'2', 'value':'Cheque'},
    {'key':'3', 'value':'Online'},
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