import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PaisService } from '../../services/pais.service';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  public usuario = {
    nombre: 'Carlos',
    email: 'carlos@mail.com',
    apellido: 'Marin',
    genero: 'M',
    pais: 'ARG' // aca toma el valor del codigo del pais
  };

  paises: any[] = [];

  constructor(private paisService: PaisService) { }

  ngOnInit(): void {
      this.paisService.getPaises()
      .subscribe( paises => {
        this.paises = paises;
        // agrega un elemento al principio del arreglo
        this.paises.unshift({nombre: 'Seleccionar pais', codigo: ''});
      });
  }

  public guardar( forma: NgForm){

  if (forma.invalid){
    Object.values(forma.controls)
    .forEach(control => {
      control.markAsTouched();
    });
    return;
  }

  //console.log(forma);
  console.log('form-data', forma.value);
  console.log('object usuario', this.usuario);
  }
}
