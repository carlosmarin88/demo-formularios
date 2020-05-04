import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor(private http: HttpClient) { }

  public getPaises(){
    return this.http.get('https://restcountries.eu/rest/v2/lang/es')
    .pipe(
      // transformo la respuesta con el pipe y el operador map y el map del array
      map((paises: any[]) => {
         return paises.map((pais: any ) => {
           return {
              nombre: pais.name,
              codigo: pais.alpha3Code,
           };
        });
      })
    );
  }
}
