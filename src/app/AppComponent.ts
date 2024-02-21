import { Component }    from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './AppComponent.html',
})
export class AppComponent {
	title = 'angular17';
}
