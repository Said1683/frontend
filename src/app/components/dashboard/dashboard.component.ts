import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx'
import readXlsxFile from 'read-excel-file'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  name: string = '';
  size: string = '';
  last: string = '';
  loading: boolean = false;
  private fileTmp: any;
  listProduct: Product[] = []
  ExcelData: any;
  data: [][] | undefined;
  constructor(
    private toastr: ToastrService,
    private _productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  //finalizar sesion y eliminación del token
  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
  //obtenermos todos los datos de la BD
  getProducts() {
    this._productService.getProducts().subscribe(data => {
      this.listProduct = data;
      console.log(data)
    })
  }
  //eliminamos registro
  deleteProduct(id: number) {
    this.loading = true;
    this._productService.deleteRegistrer(id).subscribe(() => {
      this.getProducts();
      this.toastr.warning('El producto fue eliminado con exito', 'Producto eliminado');
    })
  }
  //cargamos el excel y metadatos
  getExcel($event: any) {
    const [file] = $event.target.files;
    this.name = file.name;
    this.size = file.size;
    this.last = file.lastModifiedDate;
    this.fileTmp = {
      fileRaw: file,
      fileName: file.name
    }
  }

  // enviamos el archivo de excel
  sendExcel() {
    const body = new FormData();
    body.append('myFile', this.fileTmp.fileRaw, this.fileTmp.fileName);
    console.log(body.append)
    this._productService.sendExcels(body).subscribe(res => {
      console.log(res)
    })
  }


  /*readExcel(event: any){
    const target : DataTransfer =  <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' ,cellText:false, cellDates:true });
      const wsname : string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      console.log(ws);
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1,raw:false, dateNF:'[hh]:mm'}));
      console.log(this.data);
      const dataString = JSON.stringify(this.data);
      console.log(dataString);
      let x = this.data.slice(1);
      console.log(x);
    };

    reader.readAsBinaryString(target.files[0]);

  }*/

}
