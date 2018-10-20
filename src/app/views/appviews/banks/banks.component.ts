
import { CoreService } from './../../../_services/CoreServices.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '../../../../environments/environment';
import { Bank } from '../../../entities/models/bank';
import { BankBranches } from '../../../entities/models/BankBranches';
import { LockUp } from '../../../entities/models/LockUp';
import { Currency } from '../../../entities/models/Currency';
import { Country } from '../../../entities/models/country';
import { City } from '../../../entities/models/City';


@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.css']
})
export class BanksComponent implements OnInit {


  bankForm: Bank;
  banks: Bank[];

  branchForm: BankBranches;
  branchs: BankBranches[];

  LockUps: LockUp[];
  currencies: Currency[];

  countries: Country[];
  cities: City[];

  submit: boolean;
  submit2: boolean;
  AddUpdateUrl: string;
  bankTableColumns = ['select', 'ID', 'CODE', 'NAME', 'NAME2', 'PHONE_CODE', 'PHONE', 'actions'];
  banksDataSource: MatTableDataSource<Bank>;

  branchTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'BANK', 'actions'];
  branchsDataSource: MatTableDataSource<BankBranches>;

  selection: SelectionModel<Bank>;
  selection2: SelectionModel<BankBranches>;

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
    this.selection2 = new SelectionModel<BankBranches>(true, initialSelection);

    this.snackPosition = 'right';

    this.bankForm = new Bank();
    this.branchForm = new BankBranches();

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
          this.reloadBranchTable(this.bankForm.ID ? this.bankForm.ID : null);
          break;
      }
    });
  }

  renderBankTable(data) {
    this.banks = data;
    this.banksDataSource = new MatTableDataSource<Bank>(data);
    this.banksDataSource.paginator = this.paginator;
    this.banksDataSource.sort = this.sort;
    this.banksDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + sortData[sortHeaderId].toLocaleLowerCase();
    };
  }

  renderBranchTable(data) {
    this.branchs = data;
    this.branchsDataSource = new MatTableDataSource<BankBranches>(data);
    this.branchsDataSource.paginator = this.paginator2;
    this.branchsDataSource.sort = this.sort2;
    this.branchsDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return '2' + sortData[sortHeaderId].toLocaleLowerCase();
    };
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
    if (this.bankForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateBank';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateBank'; }
    this.http.post(this.AddUpdateUrl, this.bankForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadBankTable();
      this.bankForm = new Bank();
      this.submit = false;
      form.resetForm();
    });

  }

  deleteBank(id) {
    this.http.delete(this.coreService.DeleteUrl + '/DeleteBank?bankID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadBankTable();
    });
  }

  updateBank(bank: Bank) {
    window.scroll(0, 0);
    this.bankForm = new Bank;
    this.bankForm.ID = bank.ID;
    this.bankForm.NAME = bank.NAME;
    this.bankForm.NAME2 = bank.NAME2;
    this.bankForm.CODE = bank.CODE;
    this.bankForm.PHONE_CODE = bank.PHONE_CODE;
    this.bankForm.PHONE = bank.PHONE;
    this.bankForm.selected = true;
  }


  // add update delete city

  saveBranch(form) {
    if (form.invalid) { return; }
    this.branchForm = this.branchForm.selected ? this.branchForm : Object.assign({}, form.value);

    if (this.branchForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateBankBranch';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateBankBranch'; }
    this.http.post(this.AddUpdateUrl, this.branchForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadBranchTable(this.bankForm.ID ? this.bankForm.ID : null);
      this.branchForm = new BankBranches;
      this.submit2 = false;
      form.resetForm();
    });

  }

  deleteBranch(id) {
    this.http.delete(this.coreService.DeleteUrl + '/DeleteBankBranch?bankBranchesID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadBranchTable(this.bankForm.ID ? this.bankForm.ID : null);
    });
  }

  updateBranch(bankcBranches: BankBranches) {
    window.scroll(0, 1000);
    this.branchForm = new BankBranches;
    this.branchForm.ID = bankcBranches.ID;
    this.branchForm.NAME = bankcBranches.NAME;
    this.branchForm.NAME2 = bankcBranches.NAME;
    this.branchForm.ST_CNT_ID = bankcBranches.ST_CNT_ID;
    this.branchForm.ST_CITY_ID = bankcBranches.ST_CITY_ID;
    this.branchForm.ST_BNK_ID = bankcBranches.ST_BNK_ID;
    this.branchForm.CODE = bankcBranches.CODE;
    this.branchForm.PHONE = bankcBranches.PHONE;
    this.branchForm.PHONE_CODE = bankcBranches.PHONE_CODE;
    this.branchForm.selected = true;
  }


  loadBranchs() {
    this.coreService.loadBranchs(this.bankForm.ID ? this.bankForm.ID : null, null, 1).subscribe(data => {
      this.branchs = data;
      this.branchsDataSource = new MatTableDataSource<BankBranches>(this.branchs);
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

  getBranchName(id: number) {
    if (this.branchs) {
      for (let index = 0; index < this.branchs.length; index++) {
        if (this.branchs[index].ID === id) {
          return this.branchs[index].NAME;
        }
      }
    }
  }


  getBankName(id: number) {
    for (let index = 0; index < this.banks.length; index++) {
      if (this.banks[index].ID === id) {
        return this.banks[index].NAME;
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
