import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { PendingListComponent } from './pending-list/pending-list.component';
import { ReviewedListComponent } from './reviewed-list/reviewed-list.component';
import { PendingApplicationComponent } from './pending-application/pending-application.component';
import { ReviewedApplicationComponent } from './reviewed-application/reviewed-application.component';

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
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }