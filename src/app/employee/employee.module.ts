import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '../shared/material.module';
import { HomeComponent } from './home/home.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { PendingListComponent } from './pending-list/pending-list.component';
import { ReviewedListComponent } from './reviewed-list/reviewed-list.component';
import { ReviewedApplicationComponent } from './reviewed-application/reviewed-application.component';
import { PendingApplicationComponent } from './pending-application/pending-application.component';
import { DialogComponent } from './dialog/dialog.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { BankDetailsDialogComponent } from './bank-details-dialog/bank-details-dialog.component';
import { ViewAllWorksComponent } from './view-all-works/view-all-works.component';
import { AddWorkComponent } from './add-work/add-work.component';
import { ViewEditWorkComponent } from './view-edit-work/view-edit-work.component';



@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    ConfirmDialogComponent,
    PendingListComponent,
    ReviewedListComponent,
    ReviewedApplicationComponent,
    PendingApplicationComponent,
    DialogComponent,
    ProjectsListComponent,
    ProjectViewComponent,
    BankAccountsComponent,
    BankDetailsDialogComponent,
    ViewAllWorksComponent,
    AddWorkComponent,
    ViewEditWorkComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
