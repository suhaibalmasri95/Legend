
import { CoreService } from '../../../_services/CoreServices.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Group } from '../../../entities/models/group';
import { City } from '../../../entities/models/City';
import { LockUp } from '../../../entities/models/LockUp';
import { Area } from '../../../entities/models/Area';
import { User } from '../../../entities/models/user';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groupForm: Group;
  groups: Group[];
  groupUsers: User[];
  users: User[];
  LockUps: LockUp[];
  submit: boolean;

  groupTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'email', 'PDF', 'Word', 'RTF', 'Excel', 'Excel_Records', 'actions'];
  groupsDataSource: MatTableDataSource<Group>;

  groupUsersTableColumns = ['select', 'ID', 'NAME',];
  groupUsersDataSource: MatTableDataSource<User>;

  usersTableColumns = ['select', 'ID', 'NAME',];
  usersDataSource: MatTableDataSource<User>;

  selection: SelectionModel<Group>;
  selection2: SelectionModel<User>;
  selection3: SelectionModel<User>;


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;

  @ViewChild('table', { read: MatSort }) sort: MatSort;
  @ViewChild('table2', { read: MatSort }) sort2: MatSort;
  @ViewChild('table3', { read: MatSort }) sort3: MatSort;

  AddUpdateUrl: string;
  extraForm: string;
  snackPosition: MatSnackBarHorizontalPosition;

  constructor(public snackBar: MatSnackBar, private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {
    this.extraForm = '';
    this.snackPosition = 'right';

    this.selection = new SelectionModel<Group>(true, []);
    this.selection2 = new SelectionModel<User>(true, []);
    this.selection3 = new SelectionModel<User>(true, []);

    this.groupForm = new Group();

    this.submit = false;

    this.route.data.subscribe(data => {
      this.groups = data.group;
      this.LockUps = data.lockUp;
      this.users = data.lockUp;
      // this.currencies = data.currencies;
      this.renderGroupTable(data.group);
    });

  }



  applyFilter(filterValue: string) {
    switch (this.extraForm) {
      case '':
        this.groupsDataSource.filter = filterValue.trim().toLowerCase();
        break;
      // case 'city':
      //   this.citiesDataSource.filter = filterValue.trim().toLowerCase();
      //   break;
      // case 'area':
      //   this.areasDataSource.filter = filterValue.trim().toLowerCase();
      //   break;
    }
  }


  changeTab($event) {
    setTimeout(() => {
      switch ($event.index) {
        case 0:
          this.extraForm = '';
          this.groupsDataSource.paginator = this.groupsDataSource.paginator ? this.groupsDataSource.paginator : this.paginator;
          break;
        case 1:
          this.extraForm = 'groups';
          this.reloadUsersTables(this.groupForm.ID ? this.groupForm.ID : null);

          break;
        case 2:
          this.extraForm = 'menus';

          break;
      }
    });
  }

  renderGroupTable(data) {
    this.groups = data;
    this.groupsDataSource = new MatTableDataSource<Group>(data);
    this.groupsDataSource.paginator = this.paginator;
    this.groupsDataSource.sort = this.sort;
    this.selection = new SelectionModel<Group>(true, []);
    this.groupsDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId]) {
        return this.sort.direction === 'asc' ? '3' : '1';
      }

      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();

    };
  }


  reloadUsersTables(userId) {
    this.coreService.loadUsers().subscribe(data => {
      this.users = data;
      this.renderUsersTables(this.groupUsers, this.users);
    });
  }


  renderUsersTables(groupUsers, users) {
    this.usersDataSource = new MatTableDataSource<User>(users);
    this.usersDataSource.paginator = this.paginator2;
    this.usersDataSource.sort = this.sort2;
    this.selection2 = new SelectionModel<User>(true, []);
    this.usersDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId])
        return this.sort.direction === 'asc' ? '3' : '1';
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();
    };

    this.groupUsersDataSource = new MatTableDataSource<User>(groupUsers);
    this.groupUsersDataSource.paginator = this.paginator3;
    this.groupUsersDataSource.sort = this.sort3;
    this.selection3 = new SelectionModel<User>(true, []);
    this.groupUsersDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId])
        return this.sort.direction === 'asc' ? '3' : '1';
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();
    };
  }


  reloadGroupTable() {
    this.coreService.loadGroups(1).subscribe(data => {
      this.renderGroupTable(data);
    });
  }


  // add update delete group

  saveGroup(form) {
    if (form.invalid) {
      return;
    }

    this.groupForm = this.groupForm.selected ? this.groupForm : Object.assign({}, form.value);

    if (this.groupForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateGroup';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateGroup';
    }

    this.http.post(this.AddUpdateUrl, this.groupForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadGroupTable();
      this.groupForm = new Group;
      this.submit = false;
      form.resetForm();
    });

  }

  deleteGroup(id) {
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteGroup?groupID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadGroupTable();
    });
  }

  updateGroup(group: Group) {
    window.scroll(0, 0);
    this.groupForm = new Group;
    this.groupForm.ID = group.ID;
    this.groupForm.NAME = group.NAME;
    this.groupForm.NAME2 = group.NAME2;
    // this.groupForm.NATIONALITY = group.NATIONALITY;
    // this.groupForm.ST_CUR_CODE = group.ST_CUR_CODE;
    // this.groupForm.REFERNCE_NO = group.REFERNCE_NO;
    // this.groupForm.LOC_STATUS = group.LOC_STATUS;
    // this.groupForm.PHONE_CODE = group.PHONE_CODE;
    // this.groupForm.FLAG = group.FLAG;
    this.groupForm.selected = true;
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


  getGroupName(id: number) {
    for (let index = 0; index < this.groups.length; index++) {
      if (this.groups[index].ID === id) {
        return this.groups[index].NAME;
      }
    }
  }

  getStatusName(id: number) {
    for (let index = 0; index < this.LockUps.length; index++) {
      if (this.LockUps[index].ID === id) {
        return this.LockUps[index].NAME;
      }
    }
  }


  isAllSelected() {
    return this.selection.selected.length === this.groupsDataSource.data.length;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.groupsDataSource.data.forEach(row => this.selection.select(row));
  }


  isAllSelected2() {
    return this.selection2.selected.length === this.usersDataSource.data.length;
  }
  masterToggle2() {
    this.isAllSelected2() ? this.selection2.clear() : this.usersDataSource.data.forEach(row => this.selection2.select(row));
  }


  isAllSelected3() {
    return this.selection3.selected.length === this.groupUsersDataSource.data.length;
  }
  masterToggle3() {
    this.isAllSelected3() ? this.selection3.clear() : this.groupUsersDataSource.data.forEach(row => this.selection3.select(row));
  }

  resetForm(form) {
    form.reset();
  }



  deleteSelectedData() {

    var selectedData = [];

    switch (this.extraForm) {
      case '':
        for (let index = 0; index < this.selection.selected.length; index++)
          selectedData.push(this.selection.selected[index].ID)

        this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteGroups', { body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadGroupTable();
        });

        break;

    }

  }



  addUser() {

    if (!this.selection2.hasValue()) {
      return;
    }
    for (let index = 0; index < this.selection2.selected.length; index++)
      this.users.push(this.selection2.selected[index])

    for (let index = 0; index < this.selection2.selected.length; index++)
      for (let index2 = 0; index2 < this.groups.length; index2++)
        if (this.selection2.selected[index].ID === this.groups[index2].ID) {
          this.groups.splice(index2, 1);
        }
    this.renderUsersTables(this.groupUsers, this.users);

  }


  removeUser() {
    if (!this.selection3.hasValue()) {
      return;
    }
    for (let index = 0; index < this.selection3.selected.length; index++)
      this.groups.push(this.selection3.selected[index])

    for (let index = 0; index < this.selection3.selected.length; index++)
      for (let index2 = 0; index2 < this.users.length; index2++)
        if (this.selection3.selected[index].ID === this.users[index2].ID) {
          this.users.splice(index2, 1);
        }
    this.renderUsersTables(this.groupUsers, this.users);

  }


}
