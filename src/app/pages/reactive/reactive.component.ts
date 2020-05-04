import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit {

  forma: FormGroup;

  constructor(private fb: FormBuilder,
              private validadores: ValidadoresService) {

    this.crearFormulario();
    this.cargarDataFormulario();
    this.crearListener();
   }

  ngOnInit(): void {
  }

  private crearFormulario(): void{
    this.forma = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]], // 1ro valor, 2do validacion sincrona, 3ro validacion asincrona
      apellido: ['', [Validators.required, this.validadores.noMarin , Validators.minLength(5)]],
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      // agrego una validacion async
      usuario: ['', Validators.required , this.validadores.existeUsuario],
      pass1: ['', Validators.required],
      pass2: ['', Validators.required],
      // crear un objecto anidado
      direccion: this.fb.group({
        distrito: ['', [Validators.required, Validators.minLength(5)]],
        ciudad: ['', [Validators.required, Validators.minLength(5)]],
      }),
      pasatiempos: this.fb.array([])

    }, // La validacion se hace a nivel de formulario
    {
      validators: this.validadores.passIguales('pass1', 'pass2')
    });
  }

  private cargarDataFormulario(): void{

    // this.forma.setValue({ -> lo cambio por reset para que no me obligue todos los campos   
    this.forma.reset({
        nombre: 'Carlos',
        apellido: 'Gonzalez',
        correo: 'carlos@mail.com',
        pass1: '123',
        pass2: '123',
        direccion: {
          distrito: 'Buenos Aires',
          ciudad: 'San Miguel'
        }
      });
 //     ['Comer', 'Dormir'].forEach(valor => 
 //       this.pasatiempos.push( this.fb.control(valor)));
  }
/**
 * detectar cambios en el formulario
 */
  public crearListener(): void{
    // detectar cambios en el formulario
    // this.forma.valueChanges.subscribe(form => console.log(form));

    // detectar cambios de estado en el formulario
    // this.forma.statusChanges.subscribe(status => console.log({status}));
    
    //detectar solo los cambios en un componente especifico
    this.forma.get('nombre').valueChanges.subscribe(valor => console.log(valor));
  }

  public agregarPasatiempo(): void{
    this.pasatiempos.push( this.fb
      .control('', [Validators.required, Validators.minLength(3)] ));
  }

  public borrarPasatiempo(i: number){
    this.pasatiempos.removeAt(i);
  }

  public guardar(): void{
    // para tocar todos los input control y ver las validaciones
    console.log(this.forma);
    if (this.forma.invalid){
      this.activarValidation(this.forma);
      return;
    }

    // posteo del formulario


    // limpio el formulario pero puede ponerse un json igual que el 
    // setvalue para dejar campos completos
    this.forma.reset();
  }

  private activarValidation(formGroup: FormGroup): void{

      Object.values(formGroup.controls)
      .forEach(control => {
        if (control instanceof FormGroup){
          this.activarValidation(control);
        }
        control.markAsTouched();
      });
  }
// usando el get no permite el uso de parametros
  get nombreNovalido(): boolean{
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
  }

  public campoInvalido(campo: string): boolean{
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }

  public campoValido(campo: string): boolean{
    return this.forma.get(campo).valid && this.forma.get(campo).touched;
  }

  public getMensajeError(campo: string, campoLabel?: string): string {

    const campoName = campoLabel ? campoLabel : campo.split('.')[campo.split('.').length - 1];

    if (this.forma.get(campo).invalid && this.forma.get(campo).touched){
          const errors = this.forma.get(campo).errors;
          if (errors.noMarin){
              return 'No se permite el apellido Marin';
          }else if (errors.required){
              return `El campo  ${campoName} es requerido`;
          }else if (errors.minlength){
              return `El campo ${campoName} debe tener más de ${errors.minlength.requiredLength} letras`;
          }else if (errors.pattern){
             return `El campo ${campoName} no tiene formato valido`;
          }else if (errors.noEsIgual){
            return 'Las contraseñas no son iguales';
          }else if (errors.usuarioExiste){
            return 'El usuario ingresado ya existe';
          }
    }
    return null;
  }

  get pasatiempos(){
    return this.forma.get('pasatiempos') as FormArray;
  }

}
