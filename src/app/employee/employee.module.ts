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
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
