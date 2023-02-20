import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
//sericio de datos CRUD 
export class ProductService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/products'
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }

  newRegistrer(body: Product): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.myAppUrl}${this.myApiUrl}/add`,body)
  }

  deleteRegistrer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`)
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.myAppUrl}${this.myApiUrl}/${id}`)
  }

  updateProduct(id: number, body: Product): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`, body);
  }

  sendExcels(body: FormData): Observable<void> {
    return this.http.post<void>(`https://keyence.site:3001/api/excel/upload`, body)
  }
}
