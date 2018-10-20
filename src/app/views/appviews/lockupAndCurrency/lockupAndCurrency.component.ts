import { CoreService } from './../../../_services/CoreServices.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '../../../../environments/environment';
import { MajorCode } from '../../../entities/models/majorCode';
import { MinorCode } from '../../../entities/models/minorCode';
import { Currency } from '../../../entities/models/Currency';
import { LockUp } from '../../../entities/models/LockUp';
@Component({
  selector: 'app-lockup-and-currency',
  templateUrl: './lockupAndCurrency.component.html',
  styleUrls: ['./lockupAndCurrency.component.css']
})
export class LockupAndCurrencyComponent implements OnInit {


  extraForm: string;
  snackPosition: MatSnackBarHorizontalPosition;

  majorCodeForm: LockUp;
  majorCodes: LockUp[];

  minorCodeForm: LockUp;
  minorCodes: LockUp[];

  currencyForm: Currency;
  currencies: Currency[];

  LockUps: LockUp[];
  AddUpdateUrl: string;
  submit: boolean;
  submit2: boolean;
  submit3: boolean;

  majorCodeTableColumns = ['select', 'ID', 'MAJOR_CODE', 'NAME', 'NAME2', 'actions'];
  majorCodesDataSource: MatTableDataSource<LockUp>;

  minorCodeTableColumns = ['select', 'ID', 'MINOR_CODE', 'NAME', 'NAME2', 'actions'];
  minorCodesDataSource: MatTableDataSource<LockUp>;

  currencyTableColumns = ['select', 'CODE', 'NAME', 'NAME2', 'actions'];
  currencyDataSource: MatTableDataSource<Currency>;

  selection: SelectionModel<LockUp>;
  selection2: SelectionModel<LockUp>;
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

    this.selection = new SelectionModel<LockUp>(true, []);
    this.selection2 = new SelectionModel<LockUp>(true, []);
    this.selection3 = new SelectionModel<Currency>(true, []);


    this.majorCodeForm = new LockUp();
    this.minorCodeForm = new LockUp();

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
          this.reloadMinorCodeTable(this.majorCodeForm.ID ? this.majorCodeForm.ID : null);
          break;
        case 2:
          this.extraForm = 'currencies';
          break;
      }
    });
  }

  renderMajorCodeTable(data) {
    this.majorCodes = data;
    this.majorCodesDataSource = new MatTableDataSource<LockUp>(data);
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
    this.minorCodesDataSource = new MatTableDataSource<LockUp>(data);
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
    this.majorCodeForm.CREATED_BY = 'Admin';
    this.majorCodeForm.MINOR_CODE = 0;
    this.majorCodeForm.LOCKUP_TYPE = 2;
    if (this.majorCodeForm.ST_LOCKUP_ID > 0) {
      this.majorCodeForm.ST_LOCKUP_ID =  this.majorCodeForm.ST_LOCKUP_ID;
    } else {
      this.majorCodeForm.ST_LOCKUP_ID = null;
    }
    if (this.majorCodeForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateLockUp';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateLockUp'; }
    // tslint:disable-next-line:max-line-length
    this.http.post(this.AddUpdateUrl, this.majorCodeForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadMajorCodeTable();
      this.majorCodeForm = new LockUp();
      this.submit = false;
      form.resetForm();
    });

  }

  deleteMajorCode(id) {
    this.http.delete(this.coreService.DeleteUrl + '/DeleteLockUp?lockupID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadMajorCodeTable();
    });
  }

  updateMajorCode(majorCode: LockUp) {
    window.scroll(0, 0);
    this.majorCodeForm = new LockUp;
    this.majorCodeForm.ID = majorCode.ID;
    this.majorCodeForm.NAME = majorCode.NAME;
    this.majorCodeForm.NAME2 = majorCode.NAME2;
   this.majorCodeForm.REF_NO = majorCode.REF_NO;
   this.majorCodeForm.MODIFIED_BY = majorCode.MODIFIED_BY;
   this.majorCodeForm.MODIFICATION_DATE = majorCode.MODIFICATION_DATE;
   this.majorCodeForm.MINOR_CODE = majorCode.MINOR_CODE;
   this.majorCodeForm.MAJOR_CODE = majorCode.MAJOR_CODE;
   this.majorCodeForm.LOCKUP_TYPE = majorCode.LOCKUP_TYPE;
   this.majorCodeForm.ST_LOCKUP_ID = majorCode.ST_LOCKUP_ID;
   this.majorCodeForm.CREATED_BY = majorCode.CREATED_BY;
   this.majorCodeForm.CREATION_DATE = majorCode.CREATION_DATE;
    this.majorCodeForm.selected = true;
  }


  // add update delete MinorCode

  saveMinorCode(form) {
    if (form.invalid) { return; }
    this.minorCodeForm = this.minorCodeForm.selected ? this.minorCodeForm : Object.assign({}, form.value);
    // tslint:disable-next-line:max-line-length
    if (this.minorCodeForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateLockUp';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateLockUp'; }
    this.http.post(this.AddUpdateUrl, this.minorCodeForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadMinorCodeTable(this.majorCodeForm.ID ? this.majorCodeForm.ID : null);
      this.minorCodeForm = new LockUp;
      this.submit2 = false;
      form.resetForm();
    });

  }

  deleteMinorCode(id) {
    this.http.delete(this.coreService.DeleteUrl + '/DeleteLockUp?lockupID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadMinorCodeTable(this.majorCodeForm.ID ? this.majorCodeForm.ID : null);
    });
  }

  updateMinorCode(minorCode: LockUp) {
    window.scroll(0, 0);

    this.minorCodeForm = new LockUp;
    this.minorCodeForm.ID = minorCode.ID;
    this.minorCodeForm.NAME = minorCode.NAME;
    this.minorCodeForm.NAME2 = minorCode.NAME2;
   this.minorCodeForm.REF_NO = minorCode.REF_NO;
   this.minorCodeForm.MODIFIED_BY = minorCode.MODIFIED_BY;
   this.minorCodeForm.MODIFICATION_DATE = minorCode.MODIFICATION_DATE;
   this.minorCodeForm.MINOR_CODE = minorCode.MINOR_CODE;
   this.minorCodeForm.MAJOR_CODE = minorCode.MAJOR_CODE;
   this.minorCodeForm.LOCKUP_TYPE = minorCode.LOCKUP_TYPE;
   this.minorCodeForm.ST_LOCKUP_ID = minorCode.ST_LOCKUP_ID;
   this.minorCodeForm.CREATED_BY = minorCode.CREATED_BY;
   this.minorCodeForm.CREATION_DATE = minorCode.CREATION_DATE;
    this.minorCodeForm.selected = true;
  }


  // add update delete Currency

  saveCurrency(form) {
    if (form.invalid) { return; }
    this.currencyForm = this.currencyForm.selected ? this.currencyForm : Object.assign({}, form.value);
    if (this.currencyForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateCurrency';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateCurrency'; }
    // tslint:disable-next-line:max-line-length
    this.http.post(this.AddUpdateUrl, this.currencyForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCurrenciesTable();
      this.currencyForm = new Currency;
      this.submit3 = false;
      form.resetForm();
    });

  }

  deleteCurrency(id) {
    this.http.delete(this.coreService.DeleteUrl + '/DeleteCurrency?currencyCode=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCurrenciesTable();
    });
  }

  updateCurrency(currency: Currency) {
    window.scroll(0, 0);
    this.currencyForm = new Currency;
    // this.currencyForm.Id = currency.Id;
    this.currencyForm.NAME = currency.NAME;
    this.currencyForm.NAME2 = currency.NAME2;
    // this.currencyForm.ST_CNT_ID = currency.ST_CNT_ID;
    // this.currencyForm.Refernce_No = currency.Refernce_No;
    // this.currencyForm.Loc_Status = currency.Loc_Status;
    this.currencyForm.selected = true;
  }


  loadMinorCodes() {
    this.coreService.loadMinorCodes(this.majorCodeForm.ID ? this.majorCodeForm.ID : null, null, 1).subscribe(data => {
      this.minorCodes = data;
      this.minorCodesDataSource = new MatTableDataSource<LockUp>(this.minorCodes);
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
        if (this.minorCodes[index].ID === id) {
          return this.minorCodes[index].NAME;
        }
      }
    }
  }


  getMajorCodeName(id: number) {
    for (let index = 0; index < this.majorCodes.length; index++) {
      if (this.majorCodes[index].ID === id) {
        return this.majorCodes[index].NAME;
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
