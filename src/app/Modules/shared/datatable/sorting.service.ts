import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  constructor() { }

  SortData(columnName, order:boolean, datasource: any[]) {
    let tempDB;
    if (order) {
      if(columnName.toLowerCase()=="patientname" || columnName.toLowerCase()=='provider')
      {
      tempDB = datasource.sort((a, b) => {
        if (String(a[columnName]).toLowerCase() < String(b[columnName]).toLowerCase()) {
          return -1
        } else if (String(a[columnName]).toLowerCase() > String(b[columnName]).toLowerCase()) {
          return 1;
        }
        return 0;
      });
    }else{
      tempDB = datasource.sort((a, b) => {
        if (new Date(a[columnName]).getTime() < new Date(b[columnName]).getTime()) {
          return -1
        } else if (new Date(a[columnName]).getTime() > new Date(b[columnName]).getTime()) {
          return 1;
        }
        return 0;
      });
    }
    } else {
      if(columnName.toLowerCase()=="patientname" || columnName.toLowerCase()=='provider')
      {
      tempDB = datasource.sort((a, b) => {
        if (String(a[columnName]).toLowerCase() < String(b[columnName]).toLowerCase()) {
          return 1;
        } else if (String(a[columnName]).toLowerCase() > String(b[columnName]).toLowerCase()) {
          return  -1;
        }
        return 0;
      });
      }else{
        tempDB = datasource.sort((a, b) => {
          if (new Date(a[columnName]).getTime() < new Date(b[columnName]).getTime()) {
            return 1
          } else if (new Date(a[columnName]).getTime() > new Date(b[columnName]).getTime()) {
            return -1;
          }
          return 0;
        });
      }
    }    
    return tempDB;

  }
}
