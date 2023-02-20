import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ErrorService } from 'src/app/services/error.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  operacion: string = 'Añadir ';
  id: number;
  UserID: string = '';
  UserName: string = '';
  Date: any;
  PunchIn: string = '';
  PunchOut: string = '';
  loading: boolean = false;
  constructor(
    private toastr: ToastrService,
    private _productService: ProductService,
    private router: Router,
    private _errorService: ErrorService,
    private aRouter: ActivatedRoute

  ) {
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    console.log(this.id);
  }

  ngOnInit(): void {

    if (this.id != 0) {
      this.operacion = 'Actualizar ';
      this.getProduct(this.id);
    }

  }

  // obtener toda la info de un solo registro
  getProduct(id: number) {
    this.loading = true;
    this._productService.getProduct(id).subscribe((data: Product) => {
      console.log(data);
      this.loading = false;
      this.UserID = data.UserID;
      this.UserName = data.UserName;
      this.Date = data.Date
      this.PunchIn = data.PunchIn;
      this.PunchOut = data.PunchOut;

    })
  }

  addregistrer() {
    // Validamos que el usuario ingrese valores
    if (this.UserID == '' || this.UserName == '' || this.Date == '' || this.PunchIn == '' || this.PunchOut == '') {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    // Creamos el objeto de la interfaz del registro
    const user: Product = {
      UserID: this.UserID,
      UserName: this.UserName,
      Date: this.Date,
      PunchIn: this.PunchIn,
      PunchOut: this.PunchOut,
      id: this.id,
    }

    this.loading = true;
    // registrar un nuevo registro
    if (this.id == 0) {
      this._productService.newRegistrer(user).subscribe({
        next: (v) => {
          this.loading = false;
          this.toastr.success('Usuario registrado');
          this.router.navigate(['/dashboard']);
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      })
    } else {

      // actualizar registros seleccionado
      user.id = this.id;
      this._productService.updateProduct(this.id, user).subscribe(() => {
        this.toastr.info(`El producto fue actualizado con exito`, 'Producto actualizado');
        this.loading = false;
        this.router.navigate(['/dashboard']);
      })
    }
  }
}
