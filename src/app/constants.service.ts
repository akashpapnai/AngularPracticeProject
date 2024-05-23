import { Injectable } from '@angular/core';

@Injectable({
 providedIn: 'root'
})
export class ConstantsService {
 public ModulesConstData: any[] = [
  {imageSource: 'assets/images/master.png',altText: 'Master Image', title: 'Master', description: 'Master Description', tags: [], clicked: ''},
  {imageSource: 'assets/images/transaction.png',altText: 'Transaction Image', title: 'Transaction', description: 'Transaction Description', tags: [], clicked: ''},
  {imageSource: 'assets/images/report.png',altText: 'Report Image', title: 'Report', description: 'Report Description', tags: [], clicked: ''},
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
public religionList: string[] = [
  'Baudh',
  'Christian',
  'Hindu',
  'Islam',
  'Other',
  'Parsi',
  'Soutaal/Santal',
  'Yahudi'
];
public documentsList: string[] = [
  'Aadhar Card',
  'ABHA Card',
  'Driving Liscence',
  'Pan Card',
  'PM-JAY Card'
]
 constructor() { }
}