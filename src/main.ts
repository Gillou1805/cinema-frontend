// src/main.ts
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication }               from '@angular/platform-browser';
import { BrowserAnimationsModule }            from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS }from '@angular/common/http';
import { FormsModule }                        from '@angular/forms';

import { AppComponent }      from './app/app.component';
import { AppRoutingModule }  from './app/app-routing.module';
import { AuthInterceptor }   from './app/interceptors/auth.interceptor';



bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      AppRoutingModule
    ),

    // on enregistre l’interceptor de façon classique
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
.catch(err => console.error(err));
