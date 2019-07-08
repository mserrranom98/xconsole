import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
import { SectionsComponent } from './sections/sections.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { PagesComponent } from './page/pages.component';
import { DirectoriesComponent } from './directories/directories.component';
import { ConfigPageComponent } from './config-page/config-page.component';
import { InstitutionComponent } from './institution/institution.component';
import { UserProfilePageComponent } from './user-profile-page/user-profile-page.component';

const routes: Routes = [
    {
      path: '',
      children: [
        { path: 'users', component: UsersComponent, data: { title: 'Users' }},
        { path: 'users/new', component: UsersComponent, data: { title: 'Users'}},
        { path: 'features', component: FeaturesComponent, data: { title: 'Features'}},
        { path: 'features/new', component: FeaturesComponent, data: { title: 'Features'}},
        { path: 'sections', component: SectionsComponent, data: { title: 'Sections'}},
        { path: 'sections/new', component: SectionsComponent, data: { title: 'Sections'}},
        { path: 'profiles', component: ProfileComponent, data: { title: 'Profiles'}},
        { path: 'profiles/new', component: ProfileComponent, data: { title: 'Profiles'}},
        { path: 'page', component: PagesComponent, data: { title: 'Pages'}},
        { path: 'page/new', component: PagesComponent, data: { title: 'Pages'}},
        { path: 'directories', component: DirectoriesComponent, data: { title: 'Directories'}},
        { path: 'directories/new', component: DirectoriesComponent, data: { title: 'Directories'}},
        { path: 'config', component: ConfigPageComponent, data: { title: 'Configurations'}},
        { path: 'institutions', component: InstitutionComponent, data: { title: 'Institution'}},
        { path: 'institutions/new', component: InstitutionComponent, data: { title: 'Institution'}},
        { path: 'user/profile', component: UserProfilePageComponent, data: { title: 'Profile'}},
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class FullDesktopPagesRoutingModule { }
