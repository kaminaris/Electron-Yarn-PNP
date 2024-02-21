import { ReactiveFormsModule } from '@angular/forms';
import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { HomePageComponent }   from './Component/HomePageComponent';
import { routing }             from './HomeRouting';

@NgModule({
	imports: [
		CommonModule, routing, ReactiveFormsModule
	],
	declarations: [HomePageComponent],
	exports: [],
	providers: []
})
export class HomeModule {
}