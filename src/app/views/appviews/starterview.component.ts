import { City } from './../../models/City';
import { Currency } from './../../models/Currency';
import { LockUp } from './../../models/LockUp';
import { CoreService } from './../../_services/CoreServices.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../models/country';
import { Area } from '../../models/Area';
import { environment } from '../../../environments/environment';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-starter',
  templateUrl: 'starter.template.html'
})

export class StarterViewComponent implements OnInit, AfterViewInit {
  url: string = environment.azureUrl + 'core';

  countryForm: Country;
  countries: Country[];
  cityForm: City;
  cities: City[];
  areaForm: Area;
  areas: Area[];
  LockUps: LockUp[];
  currencies: Currency[];
  submit: boolean;
  submit2: boolean;
  submit3: boolean;
  countryTableColumns = ['select', 'Id', 'Name', 'Name2', 'Nationality', 'Currency code', 'Phone code', 'Status', 'Flag', 'actions'];
  countriesDataSource: MatTableDataSource<Country>;

  cityTableColumns = ['select', 'Id', 'Name', 'Name2', 'ST_CNT_ID', 'actions'];
  citiesDataSource: MatTableDataSource<City>;

  areaTableColumns = ['select', 'Id', 'Name', 'Name2', 'ST_CNT_ID', 'ST_CTY_ID', 'actions'];
  areasDataSource: MatTableDataSource<Area>;

  selection: SelectionModel<Country>;
  selection2: SelectionModel<City>;
  selection3: SelectionModel<Area>;

  uploader: FileUploader;
  extraForm: string;

  snackPosition: MatSnackBarHorizontalPosition;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table2', { read: MatSort }) sort2: MatSort;
  @ViewChild('table3', { read: MatSort }) sort3: MatSort;

  constructor(public snackBar: MatSnackBar, private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {
    this.extraForm = '';
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Country>(allowMultiSelect, initialSelection);
    this.selection2 = new SelectionModel<City>(allowMultiSelect, initialSelection);
    this.selection3 = new SelectionModel<Area>(allowMultiSelect, initialSelection);
    this.snackPosition = 'right';

    this.countryForm = new Country();
    this.cityForm = new City();
    this.areaForm = new Area();
    this.submit = false;
    this.submit2 = false;
    this.submit3 = false;
    this.uploader = new FileUploader({ url: this.url + '/AddCountryFlag' });

    this.route.data.subscribe(data => {
      this.countries = data.country;
      this.LockUps = data.lockUp;
      this.currencies = data.currencies;
      this.countriesDataSource = new MatTableDataSource(data.country);

    });


  }

  ngAfterViewInit(): void {
    this.countriesDataSource.paginator = this.paginator;
    this.countriesDataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    switch (this.extraForm) {
      case '':
        this.countriesDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'city':
        this.citiesDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'area':
        this.areasDataSource.filter = filterValue.trim().toLowerCase();
        break;
    }

    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.countriesDataSource.sort = this.sort;
    // this.citiesDataSource.sort = this.sort2;
    // this.areasDataSource.sort = this.sort3;
    // this.countriesDataSource.paginator = this.paginator;
    // this.citiesDataSource.paginator = this.paginator2;
    // this.areasDataSource.paginator = this.paginator3;
  }


  showCityAreaForm($event) {
    setTimeout(() => {
      switch ($event.index) {
        case 0:
          this.extraForm = '';
          this.countriesDataSource.paginator = this.countriesDataSource.paginator ? this.countriesDataSource.paginator : this.paginator;
          break;
        case 1:
          this.extraForm = 'city';
          this.reloadCityTable(this.countryForm.Id ? this.countryForm.Id : null);
          this.cityForm.ST_CNT_ID = this.countryForm.Id;
          break;
        case 2:
          this.extraForm = 'area';
          this.reloadAreaTable(this.cityForm.Id ? this.cityForm.Id : null, this.cityForm.ST_CNT_ID ? this.cityForm.ST_CNT_ID : null);
          this.areaForm.ST_CTY_ID = this.cityForm.Id;
          this.areaForm.ST_CNT_ID = this.cityForm.ST_CNT_ID;
          break;
      }
    });
  }

  renderCountryTable(data) {
    this.countries = data;
    this.countriesDataSource = new MatTableDataSource<Country>(data);
    this.countriesDataSource.paginator = this.paginator;
    this.countriesDataSource.sort = this.sort;
  }

  renderCityTable(data) {
    this.cities = data;
    this.citiesDataSource = new MatTableDataSource<City>(data);
    this.citiesDataSource.paginator = this.paginator2;
    this.citiesDataSource.sort = this.sort2;
  }
  renderAreaTable(data) {
    this.areas = data;
    this.areasDataSource = new MatTableDataSource<Area>(data);
    this.areasDataSource.paginator = this.paginator3;
    this.areasDataSource.sort = this.sort3;
  }

  reloadCountryTable() {
    this.coreService.loadCountries().subscribe(data => {
      this.renderCountryTable(data);
    });
  }

  reloadCityTable(countryId) {
    this.coreService.loadCities(countryId, null, 1).subscribe(data => {
      this.renderCityTable(data);
    });
  }

  reloadAreaTable(countryId, cityId) {
    this.coreService.loadAreas(null, cityId, countryId, 1).subscribe(data => {
      this.renderAreaTable(data);
    });
  }


  UploadFlag(form) {
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        this.countryForm.Flag = response;
        this.http.post(this.url + (this.countryForm.selected ? '/UpdateCountry' : '/InsertCountry'), this.countryForm).subscribe(res => {
          this.uploader = new FileUploader({ url: this.url + '/AddCountryFlag' });

          this.reloadCountryTable();
          this.countryForm = new Country;
          this.submit = false;
          form.resetForm();
        });
      }
    };
  }



  // add update delete country

  saveCountry(form) {
    if (form.invalid) {
      return;
    }

    this.countryForm = this.countryForm.selected ? this.countryForm : Object.assign({}, form.value);
    this.countryForm.Loc_Status = Number(this.countryForm.Loc_Status);
    if (this.uploader.queue.length > 0) {
      this.UploadFlag(form);
    } else {
      this.http.post(this.url + (this.countryForm.selected ? '/UpdateCountry' : '/InsertCountry'), this.countryForm).subscribe(res => {
        this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
        this.reloadCountryTable();
        this.countryForm = new Country;
        this.submit = false;
        form.resetForm();
      });
    }
  }

  deleteCountry(id) {
    this.http.delete(this.url + '/DeleteCountry?countryId=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCountryTable();
    });
  }

  updateCountry(country: Country) {
    window.scroll(0, 0);
    this.countryForm = new Country;
    this.countryForm.Id = country.Id;
    this.countryForm.Name = country.Name;
    this.countryForm.Name2 = country.Name2;
    this.countryForm.Nationality = country.Nationality;
    this.countryForm.ST_CUR_COD = country.ST_CUR_COD;
    this.countryForm.Refernce_No = country.Refernce_No;
    this.countryForm.Loc_Status = country.Loc_Status;
    this.countryForm.Phone_Code = country.Phone_Code;
    this.countryForm.Flag = country.Flag;
    this.countryForm.selected = true;
  }


  // add update delete city

  saveCity(form) {
    if (form.invalid) { return; }
    this.cityForm = this.cityForm.selected ? this.cityForm : Object.assign({}, form.value);
    this.cityForm.Loc_Status = Number(this.cityForm.Loc_Status);
    this.http.post(this.url + (this.cityForm.selected ? '/UpdateCity' : '/InsertCity'), this.cityForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCityTable(this.countryForm.Id ? this.countryForm.Id : null);
      this.cityForm = new City;
      this.submit2 = false;
      form.resetForm();
    });

  }

  deleteCity(id) {
    this.http.delete(this.url + '/DeleteCity?cityId=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCityTable(this.countryForm.Id ? this.countryForm.Id : null);
    });
  }

  updateCity(city: City) {
    window.scroll(0, 1000);
    this.cityForm = new City;
    this.cityForm.Id = city.Id;
    this.cityForm.Name = city.Name;
    this.cityForm.Name2 = city.Name2;
    this.cityForm.ST_CNT_ID = city.ST_CNT_ID;
    this.cityForm.Refernce_No = city.Refernce_No;
    this.cityForm.Loc_Status = city.Loc_Status;
    this.cityForm.selected = true;
  }




  // add update delete Area

  saveArea(form) {
    if (form.invalid) { return; }

    this.areaForm = this.areaForm.selected ? this.areaForm : Object.assign({}, form.value);

    this.areaForm.Loc_Status = Number(this.areaForm.Loc_Status);
    this.http.post(this.url + (this.areaForm.selected ? '/UpdateArea' : '/InsertArea'), this.areaForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadAreaTable(this.cityForm.Id ? this.cityForm.Id : null, this.cityForm.ST_CNT_ID ? this.cityForm.ST_CNT_ID : null);
      this.areaForm = new Area;
      form.resetForm();
      this.submit3 = false;
    });
  }

  deleteArea(id) {
    this.http.delete(this.url + '/DeleteArea?areaId=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadAreaTable(this.cityForm.Id ? this.cityForm.Id : null, this.cityForm.ST_CNT_ID ? this.cityForm.ST_CNT_ID : null);
    });
  }

  updateArea(area: Area) {
    window.scroll(0, 1000);
    this.areaForm = new Area;
    this.areaForm.Id = area.Id;
    this.areaForm.Name = area.Name;
    this.areaForm.Name2 = area.Name2;
    this.areaForm.ST_CTY_ID = area.ST_CTY_ID;
    this.areaForm.ST_CNT_ID = area.ST_CNT_ID;
    this.areaForm.Refernce_No = area.Refernce_No;
    this.areaForm.Loc_Status = area.Loc_Status;
    this.areaForm.selected = true;
  }



  loadCities() {
    this.coreService.loadCities(this.countryForm.Id ? this.countryForm.Id : null, null, 1).subscribe(data => {
      this.cities = data;
      this.citiesDataSource = new MatTableDataSource<City>(this.cities);
    });
  }


  replaceFileName(fileName) {
    return fileName ? fileName.replace('http://demo20180914093247.azurewebsites.net/Flags/', '') : '';
  }

  export(type, data) {
    switch (type) {
      case 'pdf':
        this.coreService.ExportToPdf(data, data);
        break;
      case 'csv':
        this.coreService.ExportToCsv(data, data);
        break;
      case 'excel':
        this.coreService.ExportToExcel(data, data);
        break;
    }

  }



  getCityName(id: number) {
    if (this.cities) {
      for (let index = 0; index < this.cities.length; index++) {
        if (this.cities[index].Id === id) {
          return this.cities[index].Name;
        }
      }
    }
  }


  getCountryName(id: number) {
    for (let index = 0; index < this.countries.length; index++) {
      if (this.countries[index].Id === id) {
        return this.countries[index].Name;
      }
    }
  }

  getStatusName(id: number) {
    for (let index = 0; index < this.LockUps.length; index++) {
      if (this.LockUps[index].Id === id) {
        return this.LockUps[index].Name;
      }
    }
  }


  isAllSelected() {
    return this.selection.selected.length === this.countriesDataSource.data.length;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.countriesDataSource.data.forEach(row => this.selection.select(row));
  }


  isAllSelected2() {
    return this.selection2.selected.length === this.citiesDataSource.data.length;
  }
  masterToggle2() {
    this.isAllSelected2() ? this.selection2.clear() : this.citiesDataSource.data.forEach(row => this.selection2.select(row));
  }


  isAllSelected3() {
    return this.selection3.selected.length === this.areasDataSource.data.length;
  }
  masterToggle3() {
    this.isAllSelected3() ? this.selection3.clear() : this.areasDataSource.data.forEach(row => this.selection3.select(row));
  }


}
