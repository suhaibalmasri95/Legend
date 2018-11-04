
import { CoreService } from './../../../_services/CoreServices.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { User } from '../../../entities/models/user';
import { LockUp } from '../../../entities/models/LockUp';
import { Country } from '../../../entities/models/country';
import { Company } from '../../../entities/models/Company';
import { CompanyBranches } from '../../../entities/models/CompanyBranches';
import { Group } from '../../../entities/models/Group';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  extraForm: string;

  userForm: User;
  users: User[];
  groups: Group[];

  LockUps: LockUp[];
  companies: Company[];
  userTypes: LockUp[];
  countries: Country[];
  userGroups: Group[];
  companyBranches: CompanyBranches[];

  submit: boolean;
  AddUpdateUrl: string;

  userTableColumns = ['select', 'ID', 'Username', 'NAME', 'NAME2', 'Company', 'Country', 'email', 'actions'];
  usersDataSource: MatTableDataSource<User>;

  groupsTableColumns = ['select', 'ID', 'NAME',];
  groupsDataSource: MatTableDataSource<Group>;

  userGroupsTableColumns = ['select', 'ID', 'NAME',];
  userGroupsDataSource: MatTableDataSource<Group>;


  selection: SelectionModel<User>;
  selection2: SelectionModel<Group>;
  selection3: SelectionModel<Group>;

  snackPosition: MatSnackBarHorizontalPosition;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator') paginator2: MatPaginator;
  @ViewChild('paginator') paginator3: MatPaginator;

  @ViewChild('table', { read: MatSort }) sort: MatSort;
  @ViewChild('table2', { read: MatSort }) sort2: MatSort;
  @ViewChild('table3', { read: MatSort }) sort3: MatSort;

  selectedItems = [];
  dropdownSettings = {};

  constructor(public snackBar: MatSnackBar, private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {
    const initialSelection = [];
    this.selection = new SelectionModel<User>(true, initialSelection);
    this.selection2 = new SelectionModel<Group>(true, initialSelection);
    this.selection3 = new SelectionModel<Group>(true, initialSelection);
    this.snackPosition = 'right';
    this.userForm = new User();
    this.submit = false;

    this.route.data.subscribe(data => {
      this.LockUps = data.lockUp;
      this.userTypes = data.userTypes;
      this.countries = data.country;
      this.companies = data.company;
      this.groups = data.groups;

      this.renderUserTable(data.users ? data.users : []);
    });


    this.userGroups = [];

    this.selectedItems = [];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'NAME',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }





  applyFilter(filterValue: string) {
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  changeTab($event) {
    setTimeout(() => {
      switch ($event.index) {
        case 0:
          this.extraForm = '';
          this.renderUserTable(this.users);
          break;
        case 1:
          this.extraForm = 'groups';
          this.reloadGroupsTables(this.userForm.ID ? this.userForm.ID : null);
          break;

      }
    });
  }



  renderUserTable(data) {
    this.users = data;
    this.usersDataSource = new MatTableDataSource<User>(data);
    this.usersDataSource.paginator = this.paginator;
    this.usersDataSource.sort = this.sort;
    this.selection = new SelectionModel<User>(true, []);
    this.usersDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();
    };
  }


  reloadUserTable() {
    this.coreService.loadUsers().subscribe(data => {
      this.renderUserTable(data);
    });
  }

  renderGroupsTables(userGroupsData, groupsData) {
    this.groupsDataSource = new MatTableDataSource<Group>(groupsData);
    this.groupsDataSource.paginator = this.paginator2;
    this.groupsDataSource.sort = this.sort2;
    this.selection2 = new SelectionModel<Group>(true, []);
    this.groupsDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();
    };

    this.userGroupsDataSource = new MatTableDataSource<Group>(userGroupsData);
    this.userGroupsDataSource.paginator = this.paginator3;
    this.userGroupsDataSource.sort = this.sort3;
    this.selection3 = new SelectionModel<Group>(true, []);
    this.userGroupsDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();
    };
  }

  reloadGroupsTables(userId) {
    this.coreService.loadGroups(2).subscribe(data => {
      this.userGroups = data;
      this.renderGroupsTables(this.userGroups, this.groups);
    });
  }


  loadCompanyBranches() {
    this.coreService.loadCopmanyBrancehs(this.userForm.ST_COM_ID ? Number(this.userForm.ST_COM_ID) : null, null, 1).subscribe(data => {
      this.companyBranches = data;
    });
  }

  // add update delete User

  saveUser(form) {
    if (form.invalid) {
      return;
    }
    this.userForm = this.userForm.selected ? this.userForm : Object.assign({}, form.value);
    if (this.userForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateUser';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateUser';
    }
    this.http.post(this.AddUpdateUrl, this.userForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadUserTable();
      this.userForm = new User();
      this.submit = false;
      form.resetForm();
    });

  }

  deleteUser(id) {
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteUser?userID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadUserTable();
    });
  }

  updateUser(user: User) {
    window.scroll(0, 0);
    this.userForm = new User;
    this.userForm.ID = user.ID;
    this.userForm.Username = user.Username;
    this.userForm.NAME = user.NAME;
    this.userForm.NAME2 = user.NAME2;
    this.userForm.mobile = user.mobile;
    this.userForm.selected = true;
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


  getUserName(id: number) {
    for (let index = 0; index < this.users.length; index++) {
      if (this.users[index].ID === id) {
        return this.users[index].NAME;
      }
    }
  }


  isAllSelected() {
    return this.selection.selected.length === this.usersDataSource.data.length;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.usersDataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected2() {
    return this.selection2.selected.length === this.groupsDataSource.data.length;
  }
  masterToggle2() {
    this.isAllSelected2() ? this.selection2.clear() : this.groupsDataSource.data.forEach(row => this.selection2.select(row));
  }

  isAllSelected3() {
    return this.selection3.selected.length === this.userGroupsDataSource.data.length;
  }
  masterToggle3() {
    this.isAllSelected3() ? this.selection3.clear() : this.userGroupsDataSource.data.forEach(row => this.selection3.select(row));
  }


  resetForm(form) {
    form.reset();
  }


  deleteSelectedData() {
    var selectedData = [];
   
    for (let index = 0; index < this.selection.selected.length; index++)
      selectedData.push(this.selection.selected[index].ID)
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteUsers', { body: selectedData }).subscribe(res => {
      this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadUserTable();
    });

  }

  replaceFileName(fileName) {
    return fileName ? fileName.substring(fileName.indexOf("Flags")) : '';
  }

  addGroup() {

    if (!this.selection2.hasValue()) {
      return;
    }
    for (let index = 0; index < this.selection2.selected.length; index++)
      this.userGroups.push(this.selection2.selected[index])

    for (let index = 0; index < this.selection2.selected.length; index++)
      for (let index2 = 0; index2 < this.groups.length; index2++)
        if (this.selection2.selected[index].ID === this.groups[index2].ID) {
          this.groups.splice(index2, 1);
        }
    this.renderGroupsTables(this.userGroups, this.groups);

  }


  removeGroup() {
    if (!this.selection3.hasValue()) {
      return;
    }
    for (let index = 0; index < this.selection3.selected.length; index++)
      this.groups.push(this.selection3.selected[index])

    for (let index = 0; index < this.selection3.selected.length; index++)
      for (let index2 = 0; index2 < this.userGroups.length; index2++)
        if (this.selection3.selected[index].ID === this.userGroups[index2].ID) {
          this.userGroups.splice(index2, 1);
        }
    this.renderGroupsTables(this.userGroups, this.groups);

  }


}


