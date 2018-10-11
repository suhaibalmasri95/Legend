import { City } from './../../models/City';
import { Currency } from './../../models/Currency';
import { LockUp } from './../../models/LockUp';
import { CoreService } from './../../_services/CoreServices.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../models/country';
import { Area } from '../../models/Area';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-starter',
  templateUrl: 'starter.template.html'
})

export class StarterViewComponent implements OnInit {
  url: string = environment.azureUrl + 'core';

  countryForm: Country;
  countries: Country[];
  cityForm: City;
  cities: City[];
  areaForm: Area;
  areas: Area[];
  LockUps: LockUp[];
  currencies: Currency[];

  countryTableColumns: string[] = ['select', 'ID', 'Name', 'Name2', 'Nationality', 'Currency code', 'Phone code', 'actions'];
  countriesDataSource = new MatTableDataSource<Country>();

  cityTableColumns: string[] = ['select', 'ID', 'Name', 'Name2', 'Country', 'actions'];
  citiesDataSource = new MatTableDataSource<City>();

  areaTableColumns: string[] = ['select', 'ID', 'Name', 'Name2', 'Country', 'City', 'actions'];
  areasDataSource = new MatTableDataSource<Area>();


  urlLoad: string;
  uploader: FileUploader;
  filePath: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<object> = new Subject();
  extraForm: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {

    this.countryForm = new Country();
    this.cityForm = new City();
    this.areaForm = new Area();

    this.route.data.subscribe(data => {
      this.countries = data.country;
      this.LockUps = data.lockUp;
      this.currencies = data.currencies;
      // this.ExportToPdf(this.countries);
    });


    this.countriesDataSource = new MatTableDataSource<Country>(this.countries);
    this.citiesDataSource = new MatTableDataSource<City>(this.cities);
    this.areasDataSource = new MatTableDataSource<Area>(this.areas);

    this.countriesDataSource.paginator = this.paginator;
    this.citiesDataSource.paginator = this.paginator;
    this.areasDataSource.paginator = this.paginator;


    this.uploader = new FileUploader({
      url: this.url + '/AddCountryFlag',
      isHTML5: true,
      allowedFileType: ['image'],
      method: 'POST',
      autoUpload: false
    });


  }


  showCityAreaForm($event) {

    this.extraForm = $event.index === 1 ? 'city' : ($event.index === 2 ? 'area' : '');

    if (this.extraForm === 'city') {
      this.coreService.loadCities(this.countryForm.Id ? this.countryForm.Id : null, null, 1).subscribe(data => {
        this.cities = data;
        this.citiesDataSource = new MatTableDataSource<City>(this.cities);
        this.cityForm.ST_CNT_ID = this.countryForm.Id;
      });
    } else if (this.extraForm === 'area') {
      // tslint:disable-next-line:max-line-length
      this.coreService.loadAreas(null, this.cityForm.Id ? this.cityForm.Id : null, this.cityForm.ST_CNT_ID ? this.cityForm.ST_CNT_ID : null, 1).subscribe(data => {
        this.areas = data;
        this.areasDataSource = new MatTableDataSource<Area>(this.areas);
        this.areaForm.ST_CTY_ID = this.cityForm.Id;
        this.areaForm.ST_CNT_ID = this.cityForm.ST_CNT_ID;

      });

    }

  }

  filterCountries(filterValue: string) {
    this.countriesDataSource.filter = filterValue.trim().toLowerCase();
  }

  filtercities(filterValue: string) {
    this.citiesDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterAreas(filterValue: string) {
    this.areasDataSource.filter = filterValue.trim().toLowerCase();
  }


  UploadFlag(form) {
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        this.filePath = response;
        this.countryForm.Flag = response;
        this.http.post(this.url + (this.countryForm.selected ? '/UpdateCountry' : '/InsertCountry'), this.countryForm).subscribe(res => {
          this.coreService.loadCountries().subscribe(data => {
            this.countries = data;
            this.countriesDataSource = new MatTableDataSource<Country>(this.countries);
            this.countryForm = new Country;
            form.resetForm();
          });
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
        this.coreService.loadCountries().subscribe(data => {
          this.countries = data;
          this.countriesDataSource = new MatTableDataSource<Country>(this.countries);
          this.countryForm = new Country;
          form.resetForm();
        });
      });
    }
  }

  deleteCountry(id) {
    this.http.delete(this.url + '/DeleteCountry?countryId=' + id).subscribe(res => {
      this.coreService.loadCountries().subscribe(data => {
        this.countries = data;
        this.countriesDataSource = new MatTableDataSource<Country>(this.countries);
      });
    });
  }

  updateCountry(country: Country) {
    this.countryForm = new Country;
    this.countryForm.Id = country.Id;
    this.countryForm.Name = country.Name;
    this.countryForm.Name2 = country.Name2;
    this.countryForm.Nationality = country.Nationality;
    this.countryForm.ST_CUR_COD = country.ST_CUR_COD;
    this.countryForm.Refernce_No = country.Refernce_No;
    this.countryForm.Loc_Status = country.Loc_Status;
    this.countryForm.Phone_Code = country.Phone_Code;
    this.countryForm.selected = country.selected;
  }


  // add update delete city

  saveCity(form) {
    if (form.invalid) { return; }
    this.cityForm = this.cityForm.selected ? this.cityForm : Object.assign({}, form.value);
    this.cityForm.Loc_Status = Number(this.cityForm.Loc_Status);
    this.http.post(this.url + (this.cityForm.selected ? '/UpdateCity' : '/InsertCity'), this.cityForm).subscribe(res => {
      this.coreService.loadCities(this.countryForm.Id ? this.countryForm.Id : null, null, 1).subscribe(data => {
        this.cities = data;
        this.citiesDataSource = new MatTableDataSource<City>(this.cities);
        this.cityForm = new City;
        form.resetForm();
      });
    });

  }

  deleteCity(id) {
    this.http.delete(this.url + '/DeleteCity?cityId=' + id).subscribe(res => {
      this.coreService.loadCities(this.countryForm.Id ? this.countryForm.Id : null, null, 1).subscribe(data => {
        this.cities = data;
        this.citiesDataSource = new MatTableDataSource<City>(this.cities);
      });
    });
  }

  loadCities() {
    this.coreService.loadCities(this.areaForm.ST_CNT_ID ? this.areaForm.ST_CNT_ID : null, null, 1).subscribe(data => {
      this.cities = data;
      this.areaForm.ST_CTY_ID = null;
    });
  }


  updateCity(city: City) {
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
      // tslint:disable-next-line:max-line-length
      this.coreService.loadAreas(null, this.cityForm.Id ? this.cityForm.Id : null, this.cityForm.ST_CNT_ID ? this.cityForm.ST_CNT_ID : null, 1).subscribe(data => {
        this.areas = data;
        this.areasDataSource = new MatTableDataSource<Area>(this.areas);
        this.areaForm = new Area;
        form.resetForm();
      });

    });
  }

  deleteArea(id) {
    this.http.delete(this.url + '/DeleteArea?areaId=' + id).subscribe(res => {
      // tslint:disable-next-line:max-line-length
      this.coreService.loadAreas(null, this.cityForm.Id ? this.cityForm.Id : null, this.cityForm.ST_CNT_ID ? this.cityForm.ST_CNT_ID : null, 1).subscribe(data => {
        this.areas = data;
        this.areasDataSource = new MatTableDataSource<Area>(this.areas);
      });
    });
  }

  updateArea(area: Area) {
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


  replaceFileName(fileName) {
    return fileName ? fileName.replace('http://demo20180914093247.azurewebsites.net/Flags/', '') : '';
  }

  ExportToPdf(objects: Object[]) {
    this.coreService.ExportToPdf(objects, 'cities', 'country').subscribe(data => {
      console.log(data);
    });
  }



  getCityName(id: number) {
    for (let index = 0; index < this.cities.length; index++) {
      if (this.cities[index].Id === id) {
        return this.cities[index].Name;
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

}
