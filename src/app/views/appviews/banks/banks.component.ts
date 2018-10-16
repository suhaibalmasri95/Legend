import { Country } from './../../../models/country';
import { City } from './../../../models/City';
import { CoreService } from './../../../_services/CoreServices.service';
import { Branch } from './../../../models/branch';
import { Bank } from './../../../models/bank';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '../../../../environments/environment';
import { Currency } from './../../../models/Currency';
import { LockUp } from './../../../models/LockUp';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.css']
})
export class BanksComponent implements OnInit {

  url: string = environment.azureUrl + 'core';

  bankForm: Bank;
  banks: Bank[];

  branchForm: Branch;
  branchs: Branch[];

  LockUps: LockUp[];
  currencies: Currency[];

  countries: Country[];
  cities: City[];

  submit: boolean;
  submit2: boolean;

  bankTableColumns = ['select', 'Id', 'Code', 'Name', 'Name2', 'Phone_Code', 'Phone', 'actions'];
  banksDataSource: MatTableDataSource<Bank>;

  branchTableColumns = ['select', 'Id', 'Name', 'Name2', 'Bank', 'actions'];
  branchsDataSource: MatTableDataSource<Branch>;

  selection: SelectionModel<Bank>;
  selection2: SelectionModel<Branch>;

  extraForm: string;

  snackPosition: MatSnackBarHorizontalPosition;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table2', { read: MatSort }) sort2: MatSort;

  constructor(public snackBar: MatSnackBar, private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {
    this.extraForm = '';
    const initialSelection = [];

    this.selection = new SelectionModel<Bank>(true, initialSelection);
    this.selection2 = new SelectionModel<Branch>(true, initialSelection);

    this.snackPosition = 'right';

    this.bankForm = new Bank();
    this.branchForm = new Branch();

    this.submit = false;
    this.submit2 = false;

    this.route.data.subscribe(data => {
      this.LockUps = data.lockUp;
      this.currencies = data.currencies;
      this.countries = data.country;
      this.renderBankTable(data.banks);
    });


  }


  applyFilter(filterValue: string) {
    switch (this.extraForm) {
      case '':
        this.banksDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'branchs':
        this.branchsDataSource.filter = filterValue.trim().toLowerCase();
        break;
    }
  }


  changeTab($event) {
    setTimeout(() => {
      switch ($event.index) {
        case 0:
          this.extraForm = '';
          this.banksDataSource.paginator = this.banksDataSource.paginator ? this.banksDataSource.paginator : this.paginator;
          break;
        case 1:
          this.extraForm = 'branchs';
          this.reloadBranchTable(this.bankForm.Id ? this.bankForm.Id : null);
          break;
      }
    });
  }

  renderBankTable(data) {
    this.banks = data;
    this.banksDataSource = new MatTableDataSource<Bank>(data);
    this.banksDataSource.paginator = this.paginator;
    this.banksDataSource.sort = this.sort;
  }

  renderBranchTable(data) {
    this.branchs = data;
    this.branchsDataSource = new MatTableDataSource<Branch>(data);
    this.branchsDataSource.paginator = this.paginator2;
    this.branchsDataSource.sort = this.sort2;
  }

  reloadBankTable() {
    this.coreService.loadBanks().subscribe(data => {
      this.renderBankTable(data);
    });
  }

  reloadBranchTable(bankId) {
    this.coreService.loadBranchs(bankId, null, 1).subscribe(data => {
      this.renderBranchTable(data);
    });
  }


  loadCities() {
    this.coreService.loadCities(this.branchForm.ST_CNT_ID ? this.branchForm.ST_CNT_ID : null, null, 1).subscribe(data => {
      this.cities = data;
    });
  }

  // add update delete Bank

  saveBank(form) {
    if (form.invalid) {
      return;
    }
    this.bankForm = this.bankForm.selected ? this.bankForm : Object.assign({}, form.value);
    this.bankForm.Loc_Status = Number(this.bankForm.Loc_Status);
    this.http.post(this.url + (this.bankForm.selected ? '/UpdateBank' : '/InsertBank'), this.bankForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadBankTable();
      this.bankForm = new Bank();
      this.submit = false;
      form.resetForm();
    });

  }

  deleteBank(id) {
    this.http.delete(this.url + '/DeleteBank?bankId=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadBankTable();
    });
  }

  updateBank(bank: Bank) {
    window.scroll(0, 0);
    this.bankForm = new Bank;
    this.bankForm.Id = bank.Id;
    this.bankForm.Name = bank.Name;
    this.bankForm.Name2 = bank.Name2;
    this.bankForm.Nationality = bank.Nationality;
    this.bankForm.ST_CUR_COD = bank.ST_CUR_COD;
    this.bankForm.Refernce_No = bank.Refernce_No;
    this.bankForm.Loc_Status = bank.Loc_Status;
    this.bankForm.Phone_Code = bank.Phone_Code;
    this.bankForm.Flag = bank.Flag;
    this.bankForm.selected = true;
  }


  // add update delete city

  saveBranch(form) {
    if (form.invalid) { return; }
    this.branchForm = this.branchForm.selected ? this.branchForm : Object.assign({}, form.value);
    this.branchForm.Loc_Status = Number(this.branchForm.Loc_Status);
    this.http.post(this.url + (this.branchForm.selected ? '/UpdateBranch' : '/InsertBranch'), this.branchForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadBranchTable(this.bankForm.Id ? this.bankForm.Id : null);
      this.branchForm = new Branch;
      this.submit2 = false;
      form.resetForm();
    });

  }

  deleteBranch(id) {
    this.http.delete(this.url + '/DeleteBranch?cityId=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadBranchTable(this.bankForm.Id ? this.bankForm.Id : null);
    });
  }

  updateBranch(city: Branch) {
    window.scroll(0, 1000);
    this.branchForm = new Branch;
    this.branchForm.Id = city.Id;
    this.branchForm.Name = city.Name;
    this.branchForm.Name2 = city.Name2;
    this.branchForm.ST_CNT_ID = city.ST_CNT_ID;
    this.branchForm.Refernce_No = city.Refernce_No;
    this.branchForm.Loc_Status = city.Loc_Status;
    this.branchForm.selected = true;
  }


  loadBranchs() {
    this.coreService.loadBranchs(this.bankForm.Id ? this.bankForm.Id : null, null, 1).subscribe(data => {
      this.branchs = data;
      this.branchsDataSource = new MatTableDataSource<Branch>(this.branchs);
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

  getBranchName(id: number) {
    if (this.branchs) {
      for (let index = 0; index < this.branchs.length; index++) {
        if (this.branchs[index].Id === id) {
          return this.branchs[index].Name;
        }
      }
    }
  }


  getBankName(id: number) {
    for (let index = 0; index < this.banks.length; index++) {
      if (this.banks[index].Id === id) {
        return this.banks[index].Name;
      }
    }
  }


  isAllSelected() {
    return this.selection.selected.length === this.banksDataSource.data.length;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.banksDataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected2() {
    return this.selection2.selected.length === this.branchsDataSource.data.length;
  }
  masterToggle2() {
    this.isAllSelected2() ? this.selection2.clear() : this.branchsDataSource.data.forEach(row => this.selection2.select(row));
  }


}
