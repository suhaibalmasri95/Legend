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
import { Subject } from 'rxjs';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

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
  countryTableColumns = ['select', 'Id', 'Name', 'Name2', 'Nationality', 'Currency code', 'Phone code', 'Flag', 'actions'];
  countriesDataSource: MatTableDataSource<Country>;

  cityTableColumns = ['select', 'Id', 'Name', 'Name2', 'ST_CNT_ID', 'actions'];
  citiesDataSource: MatTableDataSource<City>;

  areaTableColumns = ['select', 'Id', 'Name', 'Name2', 'ST_CNT_ID', 'ST_CTY_ID', 'actions'];
  areasDataSource: MatTableDataSource<Area>;


  urlLoad: string;
  uploader: FileUploader;
  filePath: string;
  dtTrigger: Subject<object> = new Subject();
  extraForm: string;


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table2', { read: MatSort }) sort2: MatSort;
  @ViewChild('table3', { read: MatSort }) sort3: MatSort;

  constructor(private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {

    this.countryForm = new Country();
    this.cityForm = new City();
    this.areaForm = new Area();
    this.submit = false;
    this.submit2 = false;
    this.submit3 = false;
    this.route.data.subscribe(data => {
      this.countries = data.country;
      this.LockUps = data.lockUp;
      this.currencies = data.currencies;
      this.countriesDataSource = new MatTableDataSource(data.country);

    });



    this.uploader = new FileUploader({
      url: this.url + '/AddCountryFlag',
      isHTML5: true,
      allowedFileType: ['image'],
      method: 'POST',
      autoUpload: false
    });


  }

  ngAfterViewInit(): void {
    this.countriesDataSource.paginator = this.paginator;
    this.countriesDataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.countriesDataSource.sort = this.sort;
    this.citiesDataSource.sort = this.sort2;
    this.areasDataSource.sort = this.sort3;
    this.countriesDataSource.paginator = this.paginator;
    this.citiesDataSource.paginator = this.paginator2;
    this.areasDataSource.paginator = this.paginator3;
  }


  showCityAreaForm($event) {
    setTimeout(() => {
      switch ($event.index) {
        case 0:
          this.extraForm = '';
          this.countriesDataSource.paginator = !this.countriesDataSource.paginator ? this.paginator : null;
          break;
        case 1:
          this.extraForm = 'city';
          //   this.citiesDataSource.paginator = !this.citiesDataSource.paginator ? this.paginator2 : null;
          this.coreService.loadCities(this.countryForm.Id ? this.countryForm.Id : null, null, 1).subscribe(data => {
            this.cities = data;
            this.citiesDataSource = new MatTableDataSource<City>(data);
            this.citiesDataSource.paginator = this.paginator2;
            this.citiesDataSource.sort = this.sort2;
            this.cityForm.ST_CNT_ID = this.countryForm.Id;
          });
          break;
        case 2:
          this.extraForm = 'area';
          //      this.areasDataSource.paginator = !this.areasDataSource.paginator ? this.paginator3 : null;
          // tslint:disable-next-line:max-line-length
          this.coreService.loadAreas(null, this.cityForm.Id ? this.cityForm.Id : null, this.cityForm.ST_CNT_ID ? this.cityForm.ST_CNT_ID : null, 1).subscribe(data => {
            this.areas = data;
            this.areasDataSource = new MatTableDataSource<Area>(data);
            this.areasDataSource.paginator = this.paginator3;
            this.areasDataSource.sort = this.sort3;
            this.areaForm.ST_CTY_ID = this.cityForm.Id;
            this.areaForm.ST_CNT_ID = this.cityForm.ST_CNT_ID;

          });
          break;
      }
    });
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
          this.submit = false;

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
    this.countryForm.selected = true;
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
        this.submit2 = false;
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
        this.submit3 = false;

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
