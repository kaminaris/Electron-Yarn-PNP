import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () => import('./Module/Home/HomeModule').then(m => m.HomeModule)
	},
];
