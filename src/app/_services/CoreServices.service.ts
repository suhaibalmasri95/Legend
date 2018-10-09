import { Country } from './../models/country';
import { Observable } from 'rxjs';
import { Currency } from './../models/Currency';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { City } from '../models/City';
import { Area } from '../models/Area';
import { LockUp } from '../models/LockUp';
@Injectable({
  providedIn: 'root'
})
export class CoreService {
  url: string = environment.azureUrl + 'core';
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
    return this.http.get<Country[]>(this.url + '/LoadCountries');
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
    return this.http.get<City[]>(this.url + '/LoadCities' + queryString);
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
    return this.http.get<Area[]>(this.url + '/LoadArea' + queryString);
  }

  loadCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.url + '/LoadCurrencies');
  }

  LoadLockUpsByMajorCode(majorCode: number = 1): Observable<LockUp[]> {
    return this.http.get<LockUp[]>(this.url + '/LoadLockUpsByMajorCode?ID=' + majorCode);
  }

  ExportToPdf(array: Array<Object>, fileName: string, Type: string): Observable<Object[]> {
    return this.http.post<Object[]>(this.utilitiesURl + '/ExportToPdf?fileName=' + fileName + '&Type=' + Type, {'countries': array});
  }

}


