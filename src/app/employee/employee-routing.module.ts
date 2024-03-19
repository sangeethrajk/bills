import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { PendingListComponent } from './pending-list/pending-list.component';
import { ReviewedListComponent } from './reviewed-list/reviewed-list.component';
import { PendingApplicationComponent } from './pending-application/pending-application.component';
import { ReviewedApplicationComponent } from './reviewed-application/reviewed-application.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { ViewAllWorksComponent } from './view-all-works/view-all-works.component';
import { AddWorkComponent } from './add-work/add-work.component';
import { ViewEditWorkComponent } from './view-edit-work/view-edit-work.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'pending-list', component: PendingListComponent },
            { path: 'pending-application/:id', component: PendingApplicationComponent },
            { path: 'reviewed-list', component: ReviewedListComponent },
            { path: 'reviewed-application/:id', component: ReviewedApplicationComponent },
            { path: 'projects-list', component: ProjectsListComponent },
            { path: 'project/:id', component: ProjectViewComponent },
            { path: 'bank-accounts', component: BankAccountsComponent },
            { path: 'works-list', component: ViewAllWorksComponent },
            { path: 'add-work', component: AddWorkComponent },
            { path: 'edit-work/:id', component: ViewEditWorkComponent }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }