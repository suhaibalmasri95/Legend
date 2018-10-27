
import { Component, OnInit, ViewChild } from '@angular/core';

import { Country } from 'src/app/entities/models/country';
import { City } from 'src/app/entities/models/City';
import { CompanyBranches } from 'src/app/entities/models/CompanyBranches';
import { Currency } from 'src/app/entities/models/Currency';
import { MatTableDataSource, MatSnackBarHorizontalPosition, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Department } from 'src/app/entities/models/department';
import { SelectionModel } from '@angular/cdk/collections';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/_services/CoreServices.service';
import { Company } from 'src/app/entities/models/Company';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  c
  companyForm: Company;
  countries: Country[];
  companies: Company[];
  companyBranchForm: CompanyBranches;
  companyBranches: CompanyBranches[];
  cities: City[];
  departmentFrom: Department;
  currencies: Currency[];
  submit: boolean;
  submit2: boolean;
  submit3: boolean;
  // tslint:disable-next-line:max-line-length
  companyTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'ST_CNT_ID', 'ST_CUR_CODE', 'PHONE_CODE', 'PHONE', 'MOBILE', 'EMAIL', 'actions'];
  companiesDataSource: MatTableDataSource<Company>;
  companyBranchTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'ST_COM_ID' , 'ST_CNT_ID' , 'ST_CTY_ID', 'CODE' , 'PHONE' ,   'actions'];
  companyBranchesDataSource: MatTableDataSource<CompanyBranches>;
  departments: Department[];
  departmentTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'ST_BRN_ID', 'EMAIL', 'actions'];
  departmentDataSource: MatTableDataSource<Department>;
  AddUpdateUrl: string;
  selection: SelectionModel<Company>;
  selection2: SelectionModel<CompanyBranches>;
  selection3: SelectionModel<Department>;

  uploader: FileUploader;
  extraForm: string;

  snackPosition: MatSnackBarHorizontalPosition;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;

  @ViewChild('table', { read: MatSort }) sort: MatSort;
  @ViewChild('table2', { read: MatSort }) sort2: MatSort;
  @ViewChild('table3', { read: MatSort }) sort3: MatSort;

  constructor(public snackBar: MatSnackBar, private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {
    this.extraForm = '';
    this.snackPosition = 'right';

    this.selection = new SelectionModel<Company>(true, []);
    this.selection2 = new SelectionModel<CompanyBranches>(true, []);
    this.selection3 = new SelectionModel<Department>(true, []);

    this.companyForm = new Company();
    this.companyBranchForm = new CompanyBranches();
    this.departmentFrom = new Department();
    this.submit = false;
    this.submit2 = false;
    this.submit3 = false;
    this.uploader = new FileUploader({ url: this.coreService.CreateUrl + '/AddCountryFlag' });


    this.route.data.subscribe(data => {
      this.countries = data.country;
      this.companies = data.company;
      this.cities = data.city;
      this.currencies = data.currencies;
      this.renderCompanyTable(data.company);
    });

  }



  applyFilter(filterValue: string) {
    switch (this.extraForm) {
      case '':
        this.companiesDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'city':
        this.companyBranchesDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'area':
        this.departmentDataSource.filter = filterValue.trim().toLowerCase();
        break;
    }
  }


  showBranchAndDepartmentForm($event) {
    setTimeout(() => {
      switch ($event.index) {
        case 0:
          this.extraForm = '';
          this.companiesDataSource.paginator = this.companiesDataSource.paginator ? this.companiesDataSource.paginator : this.paginator;
          break;
        case 1:
          this.extraForm = 'city';
          this.reloadCompanyBranchTable(this.companyForm.ID ? this.companyForm.ID : null);
          this.companyBranchForm.ST_COM_ID = this.companyForm.ID;
          break;
        case 2:
          this.extraForm = 'area';
          this.reloadDepartmentTable(this.companyBranchForm.ST_COM_ID ? this.companyBranchForm.ST_COM_ID : null);
          this.departmentFrom.ST_BRN_ID = this.companyBranchForm.ID;
          this.departmentFrom.ST_COM_ID = this.companyBranchForm.ST_COM_ID;
          break;
      }
    });
  }

  renderCompanyTable(data) {
    this.companies = data;
    this.companiesDataSource = new MatTableDataSource<Company>(data);
    this.companiesDataSource.paginator = this.paginator;
    this.companiesDataSource.sort = this.sort;
    this.selection = new SelectionModel<Company>(true, []);
    this.companiesDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }

        return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();

    };
  }

  renderCompanyBranchesTable(data) {
    this.companyBranches = data;
    this.companyBranchesDataSource = new MatTableDataSource<CompanyBranches>(data);
    this.companyBranchesDataSource.paginator = this.paginator2;
    this.companyBranchesDataSource.sort = this.sort2;
    this.selection2 = new SelectionModel<CompanyBranches>(true, []);
    this.companyBranchesDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }

        return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();

    };
  }
  renderDepartmenetTable(data) {
    this.departments = data;
    this.departmentDataSource = new MatTableDataSource<Department>(data);
    this.departmentDataSource.paginator = this.paginator3;
    this.departmentDataSource.sort = this.sort3;
    this.selection3 = new SelectionModel<Department>(true, []);
    this.departmentDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }

        return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();

    };
  }

  reloadCompanyTable() {
    this.coreService.loadCompanies().subscribe(data => {
      this.renderCompanyTable(data);
    });
  }

  reloadCompanyBranchTable(companyID = null) {
    this.coreService.loadCopmanyBrancehs(null, companyID, 1).subscribe(data => {
      this.renderCompanyBranchesTable(data);
    });
  }

  reloadDepartmentTable(companyID = null) {
    this.coreService.loadCompanyDepartments(null, companyID , 1).subscribe(data => {
      this.renderDepartmenetTable(data);
    });
  }


  UploadFlag(form) {
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        this.companyForm.LOGO = response;
        if (this.companyForm.selected) {
          this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateCompany';
        } else {
          this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateCompany';
        }

        this.http.post(this.AddUpdateUrl, this.companyForm).subscribe(res => {
          this.uploader = new FileUploader({ url: this.coreService.CreateUrl + '/AddCountryFlag' });
          this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
         this.reloadCompanyTable();
          this.companyForm = new Company;
          this.submit = false;
          form.resetForm();
        });
      }
    };
  }



  // add update delete country

  saveCompany(form) {
    if (form.invalid) {
      return;
    }

    this.companyForm = this.companyForm.selected ? this.companyForm : Object.assign({}, form.value);
    if (this.uploader.queue.length > 0) {
      this.UploadFlag(form);
    } else {
      if (this.companyForm.selected) {
        this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateCompany';
      } else {
        this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateCompany';
      }

      this.http.post(this.AddUpdateUrl, this.companyForm).subscribe(res => {
        this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
        this.reloadCompanyTable();
        this.companyForm = new Company;
        this.submit = false;
        form.resetForm();
      });
    }
  }

  deleteCompany(id) {
    this.http.delete(this.coreService.DeleteUrl + '/DeleteCompany?CompanyID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCompanyTable();
    });
  }

  updateCompany(company: Company) {
    window.scroll(0, 0);
    this.companyForm = new Company;
    this.companyForm.ID = company.ID;
    this.companyForm.NAME = company.NAME;
    this.companyForm.NAME2 = company.NAME2;
    this.companyForm.COUNTRY_CODE = company.COUNTRY_CODE;
    this.companyForm.MOBILE = company.MOBILE;
    this.companyForm.FAX = company.FAX;
    this.companyForm.EMAIL = company.EMAIL;
    this.companyForm.WEBSITE = company.WEBSITE;
    this.companyForm.ADDRESS = company.ADDRESS;
    this.companyForm.ADDRESS2 = company.ADDRESS2;
    this.companyForm.CODE = company.CODE;
    this.companyForm.ST_CUR_CODE = company.ST_CUR_CODE;
    this.companyForm.ST_CNT_ID = company.ST_CNT_ID;
    this.companyForm.LOGO = company.LOGO;
    this.companyForm.PASS_MLENGH = company.PASS_MLENGH;
    this.companyForm.PASS_MUPPER = company.PASS_MUPPER;
    this.companyForm.PASS_MLOWER = company.PASS_MLOWER;
    this.companyForm.PASS_MDIGITS = company.PASS_MDIGITS;
    this.companyForm.PASS_MSPECIAL = company.PASS_MSPECIAL;
    this.companyForm.PASS_EXPIRY_PERIOD = company.PASS_EXPIRY_PERIOD;
    this.companyForm.PASS_LOGATTEMPTS = company.PASS_LOGATTEMPTS;
    this.companyForm.PASS_REPEAT = company.PASS_REPEAT;
    this.companyForm.selected = true;
  }


  // add update delete city

  saveCompanyBranch(form) {
    if (form.invalid) { return; }
    this.companyBranchForm = this.companyBranchForm.selected ? this.companyBranchForm : Object.assign({}, form.value);
    if (this.companyBranchForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateCompanyBranch';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateCompanyBranch';
    }
    this.http.post(this.AddUpdateUrl, this.companyBranchForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCompanyBranchTable(this.companyBranchForm.ID ? this.companyBranchForm.ID : null);
      this.companyBranchForm = new CompanyBranches;
      this.submit2 = false;
      form.resetForm();
    });

  }

  deleteCompanyBranch(id) {
    this.http.delete(this.coreService.DeleteUrl + '/DeleteCompanyBranch?BranchID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadCompanyBranchTable(this.companyBranchForm.ID ? this.companyBranchForm.ID : null);
    });
  }

  updateCompanyBranch(companyBranch: CompanyBranches) {
    window.scroll(0, 1000);
    this.companyBranchForm = new CompanyBranches;
    this.companyBranchForm.ID = companyBranch.ID;
    this.companyBranchForm.NAME = companyBranch.NAME;
    this.companyBranchForm.NAME2 = companyBranch.NAME2;
    this.companyBranchForm.CODE = companyBranch.CODE;
    this.companyBranchForm.PHONE = companyBranch.PHONE;
    this.companyBranchForm.FAX = companyBranch.FAX;
    this.companyBranchForm.EMAIL = companyBranch.EMAIL;
    this.companyBranchForm.ADDRESS = companyBranch.ADDRESS;
    this.companyBranchForm.ADDRESS2 = companyBranch.ADDRESS2;
    this.companyBranchForm.ST_COM_ID = companyBranch.ST_COM_ID;
    this.companyBranchForm.ST_CTY_ID = companyBranch.ST_CTY_ID;
    this.companyBranchForm.ST_CNT_ID = companyBranch.ST_CNT_ID;
    this.companyBranchForm.ST_CUR_CODE = companyBranch.ST_CUR_CODE;
    this.companyBranchForm.selected = true;
  }




  // add update delete Area

  saveDepartment(form) {
    if (form.invalid) { return; }

    this.departmentFrom = this.departmentFrom.selected ? this.departmentFrom : Object.assign({}, form.value);
    if (this.departmentFrom.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateCompanyDepartment';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateCompanyDepartment';
    }
    this.http.post(this.AddUpdateUrl, this.departmentFrom).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadDepartmentTable(this.companyBranchForm.ST_COM_ID ? this.companyBranchForm.ST_COM_ID : null);
      this.departmentFrom = new Department;
      form.resetForm();
      this.submit3 = false;
    });
  }

  deleteDepartment(id) {
    this.http.delete(this.coreService.DeleteUrl + '/DeleteCompanyDepartment?DepartmentID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadDepartmentTable( this.companyBranchForm.ST_COM_ID ? this.companyBranchForm.ST_COM_ID : null);
    });
  }

  updateDepartment(department: Department) {
    window.scroll(0, 1000);
    this.departmentFrom = new Department;
    this.departmentFrom.ID = department.ID;
    this.departmentFrom.NAME = department.NAME;
    this.departmentFrom.NAME2 = department.NAME2;
    this.departmentFrom.ADDRESS = department.ADDRESS;
    this.departmentFrom.EMAIL = department.EMAIL;
    this.departmentFrom.ST_COM_ID = department.ST_COM_ID;
    this.departmentFrom.ST_BRN_ID = department.ST_BRN_ID;

    this.departmentFrom.selected = true;
  }



  loadCompanyBranches() {
    this.coreService.loadCopmanyBrancehs(this.companyForm.ID ? this.companyForm.ID : null, null, 1).subscribe(data => {
      this.companyBranches = data;
      this.companyBranchesDataSource = new MatTableDataSource<CompanyBranches>(this.companyBranches);
    });
  }


  replaceFileName(fileName) {
    return fileName ? fileName.substring(fileName.indexOf('Flags')) : '';
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
        if (this.cities[index].ID === id) {
          return this.cities[index].NAME;
        }
      }
    }
  }


  getCountryName(id: number) {
    for (let index = 0; index < this.countries.length; index++) {
      if (this.countries[index].ID === id) {
        return this.countries[index].NAME;
      }
    }
  }
  getCompanyName(id: number) {
    for (let index = 0; index < this.companies.length; index++) {
      if (this.companies[index].ID === id) {
        return this.companies[index].NAME;
      }
    }
  }

  getBranchName(id: number) {
    for (let index = 0; index < this.companyBranches.length; index++) {
      if (this.companyBranches[index].ID === id) {
        return this.companyBranches[index].NAME;
      }
    }
  }
  isAllSelected() {
    return this.selection.selected.length === this.companiesDataSource.data.length;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.companiesDataSource.data.forEach(row => this.selection.select(row));
  }


  isAllSelected2() {
    return this.selection2.selected.length === this.companyBranchesDataSource.data.length;
  }
  masterToggle2() {
    this.isAllSelected2() ? this.selection2.clear() : this.companyBranchesDataSource.data.forEach(row => this.selection2.select(row));
  }


  isAllSelected3() {
    return this.selection3.selected.length === this.departmentDataSource.data.length;
  }
  masterToggle3() {
    this.isAllSelected3() ? this.selection3.clear() : this.departmentDataSource.data.forEach(row => this.selection3.select(row));
  }

  resetForm(form) {
    form.reset();
  }










  deleteSelectedData() {

    var selectedData = [];
    var header = new Headers({ 'Content-Type': 'application/json' });

    switch (this.extraForm) {
      case '':
        for (let index = 0; index < this.selection.selected.length; index++)
          selectedData.push(this.selection.selected[index].ID)

        this.http.delete(this.coreService.DeleteUrl + '/DeleteCompanies', { headers: header, body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadCompanyTable();
        });
        break;
      case 'city':
        for (let index = 0; index < this.selection2.selected.length; index++)
          selectedData.push(this.selection2.selected[index].ID)

        this.http.delete(this.coreService.DeleteUrl + '/DeleteCompanyBranches', { headers: header, body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadCompanyBranchTable();
        });
        break;
      case 'area':
        for (let index = 0; index < this.selection3.selected.length; index++)
          selectedData.push(this.selection3.selected[index].ID)

        this.http.delete(this.coreService.DeleteUrl + '/DeleteCompanyDepartments', { headers: header, body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadDepartmentTable();
        });
        break;
    }

  }



}
