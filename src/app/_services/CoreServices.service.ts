
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Country } from '../entities/models/country';
import { City } from '../entities/models/City';
import { Area } from '../entities/models/Area';
import { Currency } from '../entities/models/Currency';
import { LockUp } from '../entities/models/LockUp';
import { Bank } from '../entities/models/bank';
import { BankBranches } from '../entities/models/BankBranches';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  QueryUrl: string = environment.azureUrl + 'Query';
  CreateUrl: string = environment.azureUrl + 'Create';
  UpdateUrl: string = environment.azureUrl + 'Update';
  DeleteUrl: string = environment.azureUrl + 'Delete';
  utilitiesURl: string = environment.azureUrl + 'Utilites';
  countries: Country[];
  cityForm: City;
  cities: City[];
  areaForm: Area;
  areas: Area[];
  Currencies: Currency[];
  lockUps: LockUp[];
  constructor(private http: HttpClient) { }



  loadCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.QueryUrl + '/LoadCountries ');
  }

  loadCities(countryId: number = null, cityId: number = null, langId: number = null): Observable<City[]> {
    let queryString = '?cityId=';

    if (cityId != null) {
      queryString += cityId;
    }
    queryString += '&countryId=';
    if (countryId != null) {
      queryString += countryId;
    }
    queryString += '&langId=';
    if (langId != null) {
      queryString += langId;
    }
    return this.http.get<City[]>(this.QueryUrl + '/LoadCities' + queryString);
  }

  loadAreas(areaId: number = null, cityId: number = null, countryId: number = null, langId: number = null): Observable<Area[]> {
    let queryString = '?areaId=';

    if (areaId != null) {
      queryString += areaId;
    }
    queryString += '&cityId=';
    if (cityId != null) {
      queryString += cityId;
    }
    queryString += '&countryId=';
    if (countryId != null) {
      queryString += countryId;
    }
    queryString += '&langId=';
    if (langId != null) {
      queryString += langId;
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get<Area[]>(this.QueryUrl + '/LoadAreas' + queryString);
  }

  loadCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.QueryUrl + '/LoadCurrencies');
  }

  LoadLockUpsByMajorCode(majorCode: number = 1): Observable<LockUp[]> {
    return this.http.get<LockUp[]>(this.QueryUrl + '/LoadLockUps?MajorCode=' + majorCode);
  }

  LoadLockUpStatus(majorCode: number = 1): Observable<LockUp[]> {
    return this.http.get<LockUp[]>(this.QueryUrl + '/LoadLockUpStatus?MajorCode=' + majorCode);
  }

  LoadLockUpsByMinorCode(minorCode: number = 1): Observable<LockUp[]> {
    return this.http.get<LockUp[]>(this.QueryUrl + '/LoadLockUps?MinorCode=' + minorCode);
  }

  LoadLockUpsByParentID(LockupParentID: number = 1): Observable<LockUp[]> {
    return this.http.get<LockUp[]>(this.QueryUrl + '/LoadLockUps?LockupParentID=' + LockupParentID);
  }

  ExportToPdf(fileName: string, Type: string) {
    window.open(this.utilitiesURl + '/ExportToPdf?fileName=' + fileName + '&Type=' + Type);
  }
  ExportToCsv(fileName: string, Type: string) {
    window.open(this.utilitiesURl + '/ExportToCSV?fileName=' + fileName + '&Type=' + Type);
  }
  ExportToExcel(fileName: string, Type: string) {
    window.open(this.utilitiesURl + '/ExportToExcel?fileName=' + fileName + '&Type=' + Type);

  }

  loadBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(this.QueryUrl + '/LoadBanks');
  }

  loadBranchs(countryId: number = null, cityId: number = null, langId: number = null): Observable<BankBranches[]> {
    return this.http.get<BankBranches[]>(this.QueryUrl + '/LoadBankBranches');
  }


  loadMajorCodes(): Observable<LockUp[]> {
    return this.http.get<LockUp[]>(this.QueryUrl + '/LoadLockUps');
  }



  loadMinorCodes(majorCode: number): Observable<LockUp[]> {
    let queryString = '';

    if (majorCode != null) {
      queryString += 'MajorCode=' + majorCode;
    }
    return this.http.get<LockUp[]>(this.QueryUrl + '/LoadLockUpsMinorCode?' + queryString);
  }


}


