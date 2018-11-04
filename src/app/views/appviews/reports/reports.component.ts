import { CoreService } from '../../../_services/CoreServices.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { ReportsGroup } from '../../../entities/models/ReportsGroup';
import { Report } from '../../../entities/models/Report';
import { LockUp } from '../../../entities/models/LockUp';
import { Currency } from '../../../entities/models/Currency';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportsGroupForm: ReportsGroup;
  reportsGroups: ReportsGroup[];
  reportForm: Report;
  reports: Report[];
  ;
  LockUps: LockUp[];
  currencies: Currency[];
  submit: boolean;
  submit2: boolean;

  reportsGroupTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'orderBy', 'actions'];
  reportsGroupsDataSource: MatTableDataSource<ReportsGroup>;

  reportTableColumns = ['select', 'ID', 'Code', 'NAME', 'NAME2', 'order', 'reportOrder', 'actions'];
  reportsDataSource: MatTableDataSource<Report>;

  AddUpdateUrl: string;
  selection: SelectionModel<ReportsGroup>;
  selection2: SelectionModel<Report>;

  uploader: FileUploader;
  extraForm: string;

  snackPosition: MatSnackBarHorizontalPosition;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  @ViewChild('table', { read: MatSort }) sort: MatSort;
  @ViewChild('table2', { read: MatSort }) sort2: MatSort;

  constructor(public snackBar: MatSnackBar, private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {
    this.extraForm = '';
    this.snackPosition = 'right';

    this.selection = new SelectionModel<ReportsGroup>(true, []);
    this.selection2 = new SelectionModel<Report>(true, []);

    this.reportsGroupForm = new ReportsGroup();
    this.reportForm = new Report();

    this.submit = false;
    this.submit2 = false;
    this.uploader = new FileUploader({ url: this.coreService.CreateUrl + '/AddReportsGroupFlag' });


    this.route.data.subscribe(data => {
      this.reportsGroups = data.reportsGroup;
      this.renderReportsGroupTable(data.reportsGroup);
    });

  }

  applyFilter(filterValue: string) {
    switch (this.extraForm) {
      case '':
        this.reportsGroupsDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'report':
        this.reportsDataSource.filter = filterValue.trim().toLowerCase();
        break;

    }
  }


  showReportAreaForm($event) {
    setTimeout(() => {
      switch ($event.index) {
        case 0:
          this.extraForm = '';
          this.reportsGroupsDataSource.paginator = this.reportsGroupsDataSource.paginator ? this.reportsGroupsDataSource.paginator : this.paginator;
          break;
        case 1:
          this.extraForm = 'report';
          this.reloadReportTable(this.reportsGroupForm.ID ? this.reportsGroupForm.ID : null);
          break;

      }
    });
  }

  renderReportsGroupTable(data) {
    this.reportsGroups = data;
    this.reportsGroupsDataSource = new MatTableDataSource<ReportsGroup>(data);
    this.reportsGroupsDataSource.paginator = this.paginator;
    this.reportsGroupsDataSource.sort = this.sort;
    this.selection = new SelectionModel<ReportsGroup>(true, []);
    this.reportsGroupsDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId])
        return this.sort.direction === 'asc' ? '3' : '1';
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();

    };
  }

  renderReportTable(data) {
    this.reports = data;
    this.reportsDataSource = new MatTableDataSource<Report>(data);
    this.reportsDataSource.paginator = this.paginator2;
    this.reportsDataSource.sort = this.sort2;
    this.selection2 = new SelectionModel<Report>(true, []);
    this.reportsDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId])
        return this.sort.direction === 'asc' ? '3' : '1';
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();
    };
  }


  reloadReportsGroupTable() {
    this.coreService.loadReportsGroups().subscribe(data => {
      this.renderReportsGroupTable(data);
    });
  }

  reloadReportTable(reportsGroupId = null) {
    this.coreService.loadReports(reportsGroupId, null, 1).subscribe(data => {
      this.renderReportTable(data);
    });
  }


  // add update delete reportsGroup

  saveReportsGroup(form) {
    if (form.invalid) {
      return;
    }
    this.reportsGroupForm = this.reportsGroupForm.selected ? this.reportsGroupForm : Object.assign({}, form.value);
    if (this.reportsGroupForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateReportsGroup';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateReportsGroup';
    }
    this.http.post(this.AddUpdateUrl, this.reportsGroupForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadReportsGroupTable();
      this.reportsGroupForm = new ReportsGroup;
      this.submit = false;
      form.resetForm();
    });

  }

  deleteReportsGroup(id) {
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteReportsGroup?reportsGroupID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadReportsGroupTable();
    });
  }

  updateReportsGroup(reportsGroup: ReportsGroup) {
    window.scroll(0, 0);
    this.reportsGroupForm = new ReportsGroup;
    this.reportsGroupForm.ID = reportsGroup.ID;
    this.reportsGroupForm.NAME = reportsGroup.NAME;
    this.reportsGroupForm.NAME2 = reportsGroup.NAME2;
    this.reportsGroupForm.NATIONALITY = reportsGroup.NATIONALITY;
    this.reportsGroupForm.ST_CUR_CODE = reportsGroup.ST_CUR_CODE;
    this.reportsGroupForm.REFERNCE_NO = reportsGroup.REFERNCE_NO;
    this.reportsGroupForm.LOC_STATUS = reportsGroup.LOC_STATUS;
    this.reportsGroupForm.PHONE_CODE = reportsGroup.PHONE_CODE;
    //this.reportsGroupForm.FLAG = reportsGroup.FLAG;
    this.reportsGroupForm.selected = true;
  }


  // add update delete report

  saveReport(form) {
    if (form.invalid)
      return;
    this.reportForm = this.reportForm.selected ? this.reportForm : Object.assign({}, form.value);
    if (this.reportForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateReport';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateReport';
    }
    this.http.post(this.AddUpdateUrl, this.reportForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadReportTable(this.reportsGroupForm.ID ? this.reportsGroupForm.ID : null);
      this.reportForm = new Report;
      this.submit2 = false;
      form.resetForm();
    });

  }

  deleteReport(id) {
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteReport?reportID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadReportTable(this.reportsGroupForm.ID ? this.reportsGroupForm.ID : null);
    });
  }

  updateReport(report: Report) {
    window.scroll(0, 1000);
    this.reportForm = new Report;
    this.reportForm.ID = report.ID;
    this.reportForm.NAME = report.NAME;
    this.reportForm.NAME2 = report.NAME2;
    this.reportForm.ST_CNT_ID = report.ST_CNT_ID;
    this.reportForm.REFERNCE_NO = report.REFERNCE_NO;
    this.reportForm.LOC_STATUS = report.LOC_STATUS;
    this.reportForm.selected = true;
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





  getReportsGroupName(id: number) {
    for (let index = 0; index < this.reportsGroups.length; index++) {
      if (this.reportsGroups[index].ID === id) {
        return this.reportsGroups[index].NAME;
      }
    }
  }


  isAllSelected() {
    return this.selection.selected.length === this.reportsGroupsDataSource.data.length;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.reportsGroupsDataSource.data.forEach(row => this.selection.select(row));
  }


  isAllSelected2() {
    return this.selection2.selected.length === this.reportsDataSource.data.length;
  }
  masterToggle2() {
    this.isAllSelected2() ? this.selection2.clear() : this.reportsDataSource.data.forEach(row => this.selection2.select(row));
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

        this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteReportsGroups', { body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadReportsGroupTable();
        });
        break;
      case 'report':
        for (let index = 0; index < this.selection2.selected.length; index++)
          selectedData.push(this.selection2.selected[index].ID)

        this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteReports', { body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadReportTable();
        });
        break;

    }

  }






}
