import { CoreService } from './../../../_services/CoreServices.service';
import { MinorCode } from './../../../models/minorCode';
import { MajorCode } from './../../../models/majorCode';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '../../../../environments/environment';
import { Currency } from './../../../models/Currency';
import { LockUp } from './../../../models/LockUp';

@Component({
  selector: 'app-lockup-and-currency',
  templateUrl: './lockupAndCurrency.component.html',
  styleUrls: ['./lockupAndCurrency.component.css']
})
export class LockupAndCurrencyComponent implements OnInit {

  url: string = environment.azureUrl + 'core';
  extraForm: string;
  snackPosition: MatSnackBarHorizontalPosition;

  majorCodeForm: MajorCode;
  majorCodes: MajorCode[];

  minorCodeForm: MinorCode;
  minorCodes: MinorCode[];

  currencyForm: Currency;
  currencies: Currency[];

  LockUps: LockUp[];

  submit: boolean;
  submit2: boolean;
  submit3: boolean;

  majorCodeTableColumns = ['select', 'Id', 'Code', 'Name', 'Name2', 'actions'];
  majorCodesDataSource: MatTableDataSource<MajorCode>;

  minorCodeTableColumns = ['select', 'Id', 'Name', 'Name2', 'actions'];
  minorCodesDataSource: MatTableDataSource<MinorCode>;

  currencyTableColumns = ['select', 'Id', 'Name', 'Name2', 'actions'];
  currencyDataSource: MatTableDataSource<Currency>;

  selection: SelectionModel<MajorCode>;
  selection2: SelectionModel<MinorCode>;
  selection3: SelectionModel<Currency>;


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator2') paginator3: MatPaginator;

  @ViewChild('table', { read: MatSort }) sort: MatSort;
  @ViewChild('table2', { read: MatSort }) sort2: MatSort;
  @ViewChild('table3', { read: MatSort }) sort3: MatSort;

  constructor(public snackBar: MatSnackBar, private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {
    this.extraForm = '';
    this.snackPosition = 'right';

    this.selection = new SelectionModel<MajorCode>(true, []);
    this.selection2 = new SelectionModel<MinorCode>(true, []);
    this.selection3 = new SelectionModel<Currency>(true, []);


    this.majorCodeForm = new MajorCode();
    this.minorCodeForm = new MinorCode();

    this.submit = false;
    this.submit2 = false;

    this.route.data.subscribe(data => {
      this.LockUps = data.lockUp;
      this.renderMajorCodeTable(data.currencies);
      this.renderCurrenciesTable(data.currencies);
    });


  }


  applyFilter(filterValue: string) {
    switch (this.extraForm) {
      case '':
        this.majorCodesDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'minorCodes':
        this.minorCodesDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'currencies':
        this.currencyDataSource.filter = filterValue.trim().toLowerCase();
        break;

    }
  }


  changeTab($event) {
    setTimeout(() => {
      switch ($event.index) {
        case 0:
          this.extraForm = '';
          this.majorCodesDataSource.paginator = this.majorCodesDataSource.paginator ? this.majorCodesDataSource.paginator : this.paginator;
          break;
        case 1:
          this.extraForm = 'minorCodes';
          this.reloadMinorCodeTable(this.majorCodeForm.Id ? this.majorCodeForm.Id : null);
          break;
        case 2:
          this.extraForm = 'currencies';
          break;
      }
    });
  }

  renderMajorCodeTable(data) {
    this.majorCodes = data;
    this.majorCodesDataSource = new MatTableDataSource<MajorCode>(data);
    this.majorCodesDataSource.paginator = this.paginator;
    this.majorCodesDataSource.sort = this.sort;
    this.majorCodesDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + sortData[sortHeaderId].toLocaleLowerCase();
    };
  }

  renderMinorCodeTable(data) {
    this.minorCodes = data;
    this.minorCodesDataSource = new MatTableDataSource<MinorCode>(data);
    this.minorCodesDataSource.paginator = this.paginator2;
    this.minorCodesDataSource.sort = this.sort2;
    this.minorCodesDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + sortData[sortHeaderId].toLocaleLowerCase();
    };
  }

  renderCurrenciesTable(data) {
    this.currencyForm = data;
    this.currencyDataSource = new MatTableDataSource<Currency>(data);
    this.currencyDataSource.paginator = this.paginator3;
    this.currencyDataSource.sort = this.sort3;
    this.currencyDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + sortData[sortHeaderId].toLocaleLowerCase();
    };
  }

  reloadMajorCodeTable() {
    this.coreService.loadMajorCodes().subscribe(data => {
      this.renderMajorCodeTable(data);
    });
  }

  reloadMinorCodeTable(majorCodeId) {
    this.coreService.loadMinorCodes(majorCodeId, null, 1).subscribe(data => {
      this.renderMinorCodeTable(data);
    });
  }

  reloadCurrenciesTable() {
    this.coreService.loadCurrencies().subscribe(data => {
      this.renderMinorCodeTable(data);
    });
  }


  // add update delete MajorCode

  saveMajorCode(form) {
    if (form.invalid) {
      return;
    }
    this.majorCodeForm = this.majorCodeForm.selected ? this.majorCodeForm : Object.assign({}, form.value);
    this.majorCodeForm.Loc_Status = Number(this.majorCodeForm.Loc_Status);
    // tslint:disable-next-line:max-line-length
    this.http.post(this.url + (this.majorCodeForm.selected ? '/UpdateMajorCode' : '/InsertMajorCode'), this.majorCodeForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadMajorCodeTable();
      this.majorCodeForm = new MajorCode();
      this.submit = false;
      form.resetForm();
    });

  }

  deleteMajorCode(id) {
    this.http.delete(this.url + '/DeleteMajorCode?majorCodeId=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadMajorCodeTable();
    });
  }

  updateMajorCode(majorCode: MajorCode) {
    window.scroll(0, 0);
    this.majorCodeForm = new MajorCode;
    this.majorCodeForm.Id = majorCode.Id;
    this.majorCodeForm.Name = majorCode.Name;
    this.majorCodeForm.Name2 = majorCode.Name2;
    this.majorCodeForm.Nationality = majorCode.Nationality;
    this.majorCodeForm.ST_CUR_COD = majorCode.ST_CUR_COD;
    this.majorCodeForm.Refernce_No = majorCode.Refernce_No;
    this.majorCodeForm.Loc_Status = majorCode.Loc_Status;
    this.majorCodeForm.Phone_Code = majorCode.Phone_Code;
    this.majorCodeForm.Flag = majorCode.Flag;
    this.majorCodeForm.selected = true;
  }


  // add update delete MinorCode

  saveMinorCode(form) {
    if (form.invalid) { return; }
    this.minorCodeForm = this.minorCodeForm.selected ? this.minorCodeForm : Object.assign({}, form.value);
    this.minorCodeForm.Loc_Status = Number(this.minorCodeForm.Loc_Status);
    // tslint:disable-next-line:max-line-length
    this.http.post(this.url + (this.minorCodeForm.selected ? '/UpdateMinorCode' : '/InsertMinorCode'), this.minorCodeForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadMinorCodeTable(this.majorCodeForm.Id ? this.majorCodeForm.Id : null);
      this.minorCodeForm = new MinorCode;
      this.submit2 = false;
      form.resetForm();
    });

  }

  deleteMinorCode(id) {
    this.http.delete(this.url + '/DeleteMinorCode?MinorCodeId=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadMinorCodeTable(this.majorCodeForm.Id ? this.majorCodeForm.Id : null);
    });
  }

  updateMinorCode(minorCode: MinorCode) {
    window.scroll(0, 0);
    this.minorCodeForm = new MinorCode;
    this.minorCodeForm.Id = minorCode.Id;
    this.minorCodeForm.Name = minorCode.Name;
    this.minorCodeForm.Name2 = minorCode.Name2;
    this.minorCodeForm.ST_CNT_ID = minorCode.ST_CNT_ID;
    this.minorCodeForm.Refernce_No = minorCode.Refernce_No;
    this.minorCodeForm.Loc_Status = minorCode.Loc_Status;
    this.minorCodeForm.selected = true;
  }


  // add update delete Currency

  saveCurrency(form) {
    if (form.invalid) { return; }
    this.currencyForm = this.currencyForm.selected ? this.currencyForm : Object.assign({}, form.value);
    this.currencyForm.Loc_Status = Number(this.currencyForm.Loc_Status);
    // tslint:disable-next-line:max-line-length
    this.http.post(this.url + (this.currencyForm.selected ? '/UpdateCurrency' : '/InsertCurrency'), this.currencyForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCurrenciesTable();
      this.currencyForm = new Currency;
      this.submit3 = false;
      form.resetForm();
    });

  }

  deleteCurrency(id) {
    this.http.delete(this.url + '/DeleteCurrency?CurrencyId=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCurrenciesTable();
    });
  }

  updateCurrency(currency: Currency) {
    window.scroll(0, 0);
    this.currencyForm = new Currency;
    // this.currencyForm.Id = currency.Id;
    this.currencyForm.Name = currency.Name;
    this.currencyForm.Name2 = currency.Name2;
    // this.currencyForm.ST_CNT_ID = currency.ST_CNT_ID;
    // this.currencyForm.Refernce_No = currency.Refernce_No;
    // this.currencyForm.Loc_Status = currency.Loc_Status;
    this.currencyForm.selected = true;
  }


  loadMinorCodes() {
    this.coreService.loadMinorCodes(this.majorCodeForm.Id ? this.majorCodeForm.Id : null, null, 1).subscribe(data => {
      this.minorCodes = data;
      this.minorCodesDataSource = new MatTableDataSource<MinorCode>(this.minorCodes);
    });
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

  getMinorCodeName(id: number) {
    if (this.minorCodes) {
      for (let index = 0; index < this.minorCodes.length; index++) {
        if (this.minorCodes[index].Id === id) {
          return this.minorCodes[index].Name;
        }
      }
    }
  }


  getMajorCodeName(id: number) {
    for (let index = 0; index < this.majorCodes.length; index++) {
      if (this.majorCodes[index].Id === id) {
        return this.majorCodes[index].Name;
      }
    }
  }


  isAllSelected() {
    return this.selection.selected.length === this.majorCodesDataSource.data.length;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.majorCodesDataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected2() {
    return this.selection2.selected.length === this.minorCodesDataSource.data.length;
  }
  masterToggle2() {
    this.isAllSelected2() ? this.selection2.clear() : this.minorCodesDataSource.data.forEach(row => this.selection2.select(row));
  }

  isAllSelected3() {
    return this.selection2.selected.length === this.currencyDataSource.data.length;
  }
  masterToggle3() {
    this.isAllSelected3() ? this.selection3.clear() : this.currencyDataSource.data.forEach(row => this.selection3.select(row));
  }


}
