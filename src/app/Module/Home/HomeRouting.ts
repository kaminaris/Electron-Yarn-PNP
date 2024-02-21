import { ModuleWithProviders }   from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { HomePageComponent }     from './Component/HomePageComponent';

const routes: Routes = [
	{
		path: '',
		component: HomePageComponent,
	}
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
