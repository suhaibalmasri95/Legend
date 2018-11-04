
import { CoreService } from '../../../_services/CoreServices.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { System, Module, SubModule, Page, Action } from '../../../entities/models/MenuDetails';

@Component({
  selector: 'app-menu-details',
  templateUrl: 'menuDetails.component.html'
})

export class MenuDetails implements OnInit {
  systemForm: System;
  systems: System[];

  moduleForm: Module;
  modules: Module[];

  subModuleForm: SubModule;
  subModules: SubModule[];

  pageForm: Page;
  pages: Page[];

  actionForm: Action;
  actions: Action[];

  submit: boolean;
  submit2: boolean;
  submit3: boolean;
  submit4: boolean;
  submit5: boolean;

  systemTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'order', 'actions'];
  systemsDataSource: MatTableDataSource<System>;

  moduleTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'order', 'System', 'actions'];
  modulesDataSource: MatTableDataSource<Module>;

  subModuleTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'order', 'System', 'Module', 'actions'];
  subModulesDataSource: MatTableDataSource<SubModule>;

  pageTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'order', 'System', 'Module', 'actions'];
  pagesDataSource: MatTableDataSource<Page>;

  actionTableColumns = ['select', 'ID', 'NAME', 'NAME2', 'order', 'System', 'Module', 'actions'];
  actionsDataSource: MatTableDataSource<Action>;



  AddUpdateUrl: string;
  selection: SelectionModel<System>;
  selection2: SelectionModel<Module>;
  selection3: SelectionModel<SubModule>;
  selection4: SelectionModel<Page>;
  selection5: SelectionModel<Action>;

  uploader: FileUploader;
  extraForm: string;

  snackPosition: MatSnackBarHorizontalPosition;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild('paginator4') paginator4: MatPaginator;
  @ViewChild('paginator5') paginator5: MatPaginator;

  @ViewChild('table', { read: MatSort }) sort: MatSort;
  @ViewChild('table2', { read: MatSort }) sort2: MatSort;
  @ViewChild('table3', { read: MatSort }) sort3: MatSort;
  @ViewChild('table4', { read: MatSort }) sort4: MatSort;
  @ViewChild('table5', { read: MatSort }) sort5: MatSort;

  constructor(public snackBar: MatSnackBar, private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {
    this.extraForm = '';
    this.snackPosition = 'right';

    this.selection = new SelectionModel<System>(true, []);
    this.selection2 = new SelectionModel<Module>(true, []);
    this.selection3 = new SelectionModel<SubModule>(true, []);
    this.selection4 = new SelectionModel<Page>(true, []);
    this.selection5 = new SelectionModel<Action>(true, []);

    this.systemForm = new System();
    this.moduleForm = new Module();
    this.subModuleForm = new SubModule();
    this.pageForm = new Page();
    this.actionForm = new Action();

    this.submit = false;
    this.submit2 = false;
    this.submit3 = false;
    this.submit4 = false;
    this.submit5 = false;

    this.route.data.subscribe(data => {
      this.systems = data.system;
      this.renderSystemTable(data.system);
    });

  }



  applyFilter(filterValue: string) {
    switch (this.extraForm) {
      case '':
        this.systemsDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'module':
        this.modulesDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'subModule':
        this.subModulesDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'page':
        this.pagesDataSource.filter = filterValue.trim().toLowerCase();
        break;
      case 'action':
        this.actionsDataSource.filter = filterValue.trim().toLowerCase();
        break;
    }
  }


  changeTab($event) {
    setTimeout(() => {
      switch ($event.index) {
        case 0:
          this.extraForm = '';
          this.systemsDataSource.paginator = this.systemsDataSource.paginator ? this.systemsDataSource.paginator : this.paginator;
          break;
        case 1:
          this.extraForm = 'module';
          this.reloadModuleTable(this.systemForm.ID ? this.systemForm.ID : null);
          this.moduleForm.ST_CNT_ID = this.systemForm.ID;
          break;
        case 2:
          this.extraForm = 'subModule';
          this.reloadSubModuleTable(this.moduleForm.ID ? this.moduleForm.ID : null, this.moduleForm.ST_CNT_ID ? this.moduleForm.ST_CNT_ID : null);
          this.subModuleForm.ST_CTY_ID = this.moduleForm.ID;
          this.subModuleForm.ST_CNT_ID = this.moduleForm.ST_CNT_ID;
          break;
        case 3:
          this.extraForm = 'page';
          this.reloadPageTable(this.moduleForm.ID ? this.moduleForm.ID : null, this.moduleForm.ST_CNT_ID ? this.moduleForm.ST_CNT_ID : null);
          this.pageForm.ST_CTY_ID = this.moduleForm.ID;
          this.pageForm.ST_CNT_ID = this.moduleForm.ST_CNT_ID;
          break;
        case 4:
          this.extraForm = 'action';
          this.reloadActionTable(this.moduleForm.ID ? this.moduleForm.ID : null, this.moduleForm.ST_CNT_ID ? this.moduleForm.ST_CNT_ID : null);
          this.actionForm.ST_CTY_ID = this.moduleForm.ID;
          this.actionForm.ST_CNT_ID = this.moduleForm.ST_CNT_ID;
          break;
      }
    });
  }

  renderSystemTable(data) {
    this.systems = data;
    this.systemsDataSource = new MatTableDataSource<System>(data);
    this.systemsDataSource.paginator = this.paginator;
    this.systemsDataSource.sort = this.sort;
    this.selection = new SelectionModel<System>(true, []);
    this.systemsDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId])
        return this.sort.direction === 'asc' ? '3' : '1';
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();
    };
  }

  renderModuleTable(data) {
    this.modules = data;
    this.modulesDataSource = new MatTableDataSource<Module>(data);
    this.modulesDataSource.paginator = this.paginator2;
    this.modulesDataSource.sort = this.sort2;
    this.selection2 = new SelectionModel<Module>(true, []);
    this.modulesDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId])
        return this.sort.direction === 'asc' ? '3' : '1';
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();

    };
  }
  renderSubModuleTable(data) {
    this.subModules = data;
    this.subModulesDataSource = new MatTableDataSource<SubModule>(data);
    this.subModulesDataSource.paginator = this.paginator3;
    this.subModulesDataSource.sort = this.sort3;
    this.selection3 = new SelectionModel<SubModule>(true, []);
    this.subModulesDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId])
        return this.sort.direction === 'asc' ? '3' : '1';
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();

    };
  }

  rendePageTable(data) {
    this.pages = data;
    this.pagesDataSource = new MatTableDataSource<Page>(data);
    this.pagesDataSource.paginator = this.paginator4;
    this.pagesDataSource.sort = this.sort4;
    this.selection4 = new SelectionModel<Page>(true, []);
    this.pagesDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId])
        return this.sort.direction === 'asc' ? '3' : '1';
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();

    };
  }

  renderActionTable(data) {
    this.actions = data;
    this.actionsDataSource = new MatTableDataSource<Action>(data);
    this.actionsDataSource.paginator = this.paginator5;
    this.actionsDataSource.sort = this.sort5;
    this.selection5 = new SelectionModel<Action>(true, []);
    this.actionsDataSource.sortingDataAccessor = (sortData, sortHeaderId) => {
      if (!sortData[sortHeaderId])
        return this.sort.direction === 'asc' ? '3' : '1';
      return /^\d+$/.test(sortData[sortHeaderId]) ? Number('2' + sortData[sortHeaderId]) : '2' + sortData[sortHeaderId].toString().toLocaleLowerCase();

    };
  }

  reloadSystemTable() {
    this.coreService.loadSystems().subscribe(data => {
      this.renderSystemTable(data);
    });
  }

  reloadModuleTable(systemId = null) {
    this.coreService.loadModules(systemId, null, 1).subscribe(data => {
      this.renderModuleTable(data);
    });
  }

  reloadSubModuleTable(systemId = null, moduleId = null) {
    this.coreService.loadSubModules(null, moduleId, systemId, 1).subscribe(data => {
      this.rendePageTable(data);
    });
  }

  reloadPageTable(systemId = null, moduleId = null) {
    this.coreService.loadPages(null, moduleId, systemId, 1).subscribe(data => {
      this.rendePageTable(data);
    });
  }

  reloadActionTable(systemId = null, moduleId = null) {
    this.coreService.loadActions(null, moduleId, systemId, 1).subscribe(data => {
      this.renderActionTable(data);
    });
  }



  // add update delete system

  saveSystem(form) {
    if (form.invalid) {
      return;
    }

    this.systemForm = this.systemForm.selected ? this.systemForm : Object.assign({}, form.value);
    this.systemForm.LOC_STATUS = Number(this.systemForm.LOC_STATUS);

    if (this.systemForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateSystem';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateSystem';
    }

    this.http.post(this.AddUpdateUrl, this.systemForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadSystemTable();
      this.systemForm = new System;
      this.submit = false;
      form.resetForm();
    });

  }

  deleteSystem(id) {
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteSystem?systemID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadSystemTable();
    });
  }

  updateSystem(system: System) {
    window.scroll(0, 0);
    this.systemForm = new System;
    this.systemForm.ID = system.ID;
    this.systemForm.NAME = system.NAME;
    this.systemForm.NAME2 = system.NAME2;

    this.systemForm.REFERNCE_NO = system.REFERNCE_NO;
    this.systemForm.LOC_STATUS = system.LOC_STATUS;

    this.systemForm.selected = true;
  }


  // add update delete module

  saveModule(form) {
    if (form.invalid) { return; }
    this.moduleForm = this.moduleForm.selected ? this.moduleForm : Object.assign({}, form.value);
    this.moduleForm.LOC_STATUS = Number(this.moduleForm.LOC_STATUS);
    if (this.moduleForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateModule';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateModule';
    }
    this.http.post(this.AddUpdateUrl, this.moduleForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadModuleTable(this.systemForm.ID ? this.systemForm.ID : null);
      this.moduleForm = new Module;
      this.submit2 = false;
      form.resetForm();
    });

  }

  deleteModule(id) {
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteModule?moduleID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadModuleTable(this.systemForm.ID ? this.systemForm.ID : null);
    });
  }

  updateModule(module: Module) {
    window.scroll(0, 1000);
    this.moduleForm = new Module;
    this.moduleForm.ID = module.ID;
    this.moduleForm.NAME = module.NAME;
    this.moduleForm.NAME2 = module.NAME2;
    this.moduleForm.ST_CNT_ID = module.ST_CNT_ID;
    this.moduleForm.REFERNCE_NO = module.REFERNCE_NO;
    this.moduleForm.LOC_STATUS = module.LOC_STATUS;
    this.moduleForm.selected = true;
  }




  // add update delete SubModule

  saveSubModule(form) {
    if (form.invalid) { return; }

    this.subModuleForm = this.subModuleForm.selected ? this.subModuleForm : Object.assign({}, form.value);

    this.subModuleForm.LOC_STATUS = Number(this.subModuleForm.LOC_STATUS);
    if (this.subModuleForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateSubModule';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateSubModule';
    }
    this.http.post(this.AddUpdateUrl, this.subModuleForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadSubModuleTable(this.moduleForm.ID ? this.moduleForm.ID : null, this.moduleForm.ST_CNT_ID ? this.moduleForm.ST_CNT_ID : null);
      this.subModuleForm = new SubModule;
      form.resetForm();
      this.submit3 = false;
    });
  }

  deleteSubModule(id) {
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteSubModule?subModuleID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadSubModuleTable(this.moduleForm.ID ? this.moduleForm.ID : null, this.moduleForm.ST_CNT_ID ? this.moduleForm.ST_CNT_ID : null);
    });
  }

  updateSubModule(subModule: SubModule) {
    window.scroll(0, 1000);
    this.subModuleForm = new SubModule;
    this.subModuleForm.ID = subModule.ID;
    this.subModuleForm.NAME = subModule.NAME;
    this.subModuleForm.NAME2 = subModule.NAME2;
    this.subModuleForm.ST_CTY_ID = subModule.ST_CTY_ID;
    this.subModuleForm.ST_CNT_ID = subModule.ST_CNT_ID;
    this.subModuleForm.REFERNCE_NO = subModule.REFERNCE_NO;
    this.subModuleForm.LOC_STATUS = subModule.LOC_STATUS;
    this.subModuleForm.selected = true;
  }

  // add update delete SubModule

  savePage(form) {
    if (form.invalid) { return; }

    this.pageForm = this.pageForm.selected ? this.pageForm : Object.assign({}, form.value);

    this.pageForm.LOC_STATUS = Number(this.pageForm.LOC_STATUS);
    if (this.pageForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateSubModule';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateSubModule';
    }
    this.http.post(this.AddUpdateUrl, this.pageForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadSubModuleTable(this.subModuleForm.ID ? this.subModuleForm.ID : null, this.subModuleForm.ST_CNT_ID ? this.subModuleForm.ST_CNT_ID : null);
      this.pageForm = new Page;
      form.resetForm();
      this.submit3 = false;
    });
  }

  deletePage(id) {
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteSubModule?subModuleID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadPageTable(this.subModuleForm.ID ? this.subModuleForm.ID : null, this.subModuleForm.ST_CNT_ID ? this.subModuleForm.ST_CNT_ID : null);
    });
  }

  updatePage(page: Page) {
    window.scroll(0, 1000);
    this.pageForm = new Page;
    this.pageForm.ID = page.ID;
    this.pageForm.NAME = page.NAME;
    this.pageForm.NAME2 = page.NAME2;
    this.pageForm.ST_CTY_ID = page.ST_CTY_ID;
    this.pageForm.ST_CNT_ID = page.ST_CNT_ID;
    this.pageForm.REFERNCE_NO = page.REFERNCE_NO;
    this.pageForm.LOC_STATUS = page.LOC_STATUS;
    this.pageForm.selected = true;
  }


  // add update delete SubModule

  saveAction(form) {
    if (form.invalid) { return; }

    this.actionForm = this.actionForm.selected ? this.actionForm : Object.assign({}, form.value);

    this.actionForm.LOC_STATUS = Number(this.actionForm.LOC_STATUS);
    if (this.actionForm.selected) {
      this.AddUpdateUrl = this.coreService.UpdateUrl + '/UpdateSubModule';
    } else {
      this.AddUpdateUrl = this.coreService.CreateUrl + '/CreateSubModule';
    }
    this.http.post(this.AddUpdateUrl, this.actionForm).subscribe(res => {
      this.snackBar.open('Saved successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadSubModuleTable(this.pageForm.ID ? this.pageForm.ID : null, this.pageForm.ST_CNT_ID ? this.pageForm.ST_CNT_ID : null);
      this.actionForm = new Action;
      form.resetForm();
      this.submit3 = false;
    });
  }

  deleteAction(id) {
    this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteSubModule?subModuleID=' + id).subscribe(res => {
      this.snackBar.open('Deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
      this.reloadSubModuleTable(this.pageForm.ID ? this.pageForm.ID : null, this.pageForm.ST_CNT_ID ? this.pageForm.ST_CNT_ID : null);
    });
  }

  updateAction(action: Action) {
    window.scroll(0, 1000);
    this.actionForm = new Action;
    this.actionForm.ID = action.ID;
    this.actionForm.NAME = action.NAME;
    this.actionForm.NAME2 = action.NAME2;
    this.actionForm.ST_CTY_ID = action.ST_CTY_ID;
    this.actionForm.ST_CNT_ID = action.ST_CNT_ID;
    this.actionForm.REFERNCE_NO = action.REFERNCE_NO;
    this.actionForm.LOC_STATUS = action.LOC_STATUS;
    this.actionForm.selected = true;
  }


  loadModules() {
    this.coreService.loadModules(this.systemForm.ID ? this.systemForm.ID : null, null, 1).subscribe(data => {
      this.modules = data;
      this.modulesDataSource = new MatTableDataSource<Module>(this.modules);
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



  getModuleName(id: number) {
    return '';
    for (let index = 0; index < this.modules.length; index++)
      if (this.modules[index].ID === id)
        return this.modules[index].NAME;
  }


  getSystemName(id: number) {
    return '';
    for (let index = 0; index < this.systems.length; index++)
      if (this.systems[index].ID === id)
        return this.systems[index].NAME;
  }




  isAllSelected() {
    return this.selection.selected.length === this.systemsDataSource.data.length;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.systemsDataSource.data.forEach(row => this.selection.select(row));
  }


  isAllSelected2() {
    return this.selection2.selected.length === this.modulesDataSource.data.length;
  }
  masterToggle2() {
    this.isAllSelected2() ? this.selection2.clear() : this.modulesDataSource.data.forEach(row => this.selection2.select(row));
  }


  isAllSelected3() {
    return this.selection3.selected.length === this.subModulesDataSource.data.length;
  }
  masterToggle3() {
    this.isAllSelected3() ? this.selection3.clear() : this.subModulesDataSource.data.forEach(row => this.selection3.select(row));
  }

  isAllSelected4() {
    return this.selection4.selected.length === this.pagesDataSource.data.length;
  }
  masterToggle4() {
    this.isAllSelected4() ? this.selection4.clear() : this.pagesDataSource.data.forEach(row => this.selection4.select(row));
  }

  isAllSelected5() {
    return this.selection5.selected.length === this.actionsDataSource.data.length;
  }
  masterToggle5() {
    this.isAllSelected5() ? this.selection5.clear() : this.actionsDataSource.data.forEach(row => this.selection5.select(row));
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

        this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteSystems', { body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadSystemTable();
        });
        break;
      case 'module':
        for (let index = 0; index < this.selection2.selected.length; index++)
          selectedData.push(this.selection2.selected[index].ID)

        this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteModules', { body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadModuleTable();
        });
        break;
      case 'subModule':
        for (let index = 0; index < this.selection3.selected.length; index++)
          selectedData.push(this.selection3.selected[index].ID)

        this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteSubModules', { body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadSubModuleTable();
        });
        break;
      case 'page':
        for (let index = 0; index < this.selection4.selected.length; index++)
          selectedData.push(this.selection4.selected[index].ID)

        this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteSubModules', { body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadPageTable();
        });
        break;
      case 'action':
        for (let index = 0; index < this.selection5.selected.length; index++)
          selectedData.push(this.selection5.selected[index].ID)

        this.http.request('DELETE', this.coreService.DeleteUrl + '/DeleteSubModules', { body: selectedData }).subscribe(res => {
          this.snackBar.open('deleted successfully', '', { duration: 3000, horizontalPosition: this.snackPosition });
          this.reloadActionTable();
        });
        break;
    }

  }






}
