import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './models/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get( `${baseUrl}product`);
  }

  getProductById(productId: number): Observable<any> {
    return this.http.get(`${baseUrl}product/${productId}`);
  }

  updateProduct(productId: number, updatedProduct: Product): Observable<any> {
    return this.http.put(`${baseUrl}product/${productId}`, updatedProduct);
  }

  deleteProduct(productId: number) {
    return this.http.delete(`${baseUrl}product/${productId}`);
  }

  createProduct(product: Product) {
    return this.http.post(`${baseUrl}product`, product);
  }
  // getRoleByUser(farmerId: number): Observable<Farmer[]> {
  //   return this.http.get(`user/role/${userId}`);
  // }
  // addRolesOfUser(rqrole: RqListRole)  {
  //   return this.http.post(`user/addlistrole`, rqrole);
  // }
  // deleteRoleOfUser(userId: number, role: string ) {
  //   return this.http.delete(`user/${userId}/${role}`);
  // }
  // role
  // getRoles(): Observable<RoleOfUser[]> {
  //   return this.http.get(`role`);
  // }
  // getRoleNotExist(userId: number): Observable<Role[]> {
  //   return this.http.get(`role/rolenotexists/${userId}`);
  // }

}