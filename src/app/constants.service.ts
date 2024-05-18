import { Injectable } from '@angular/core';

@Injectable({
 providedIn: 'root'
})
export class ConstantsService {
 public ModulesConstData: any[] = [
  {imageSource: 'assets/images/master.png',altText: 'Master Image', title: 'Master', description: 'Master Description', tags: []},
  {imageSource: 'assets/images/transaction.png',altText: 'Transaction Image', title: 'Transaction', description: 'Transaction Description', tags: []},
  {imageSource: 'assets/images/report.png',altText: 'Report Image', title: 'Report', description: 'Report Description', tags: []},
];
 constructor() { }
}