/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompanybranchComponent } from './companybranch.component';

describe('CompanybranchComponent', () => {
  let component: CompanybranchComponent;
  let fixture: ComponentFixture<CompanybranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanybranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanybranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
