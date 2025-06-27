import { bootstrapApplication } from '@angular/platform-browser';
import { HeroisComponent } from './app/pages/herois/herois.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(HeroisComponent, {
  providers: [provideHttpClient()]
});
