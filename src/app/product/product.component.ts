import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../models/product';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../product.service';
import { MatDialog } from '@angular/material/dialog';
import { CrudProductComponent } from './crud-product/crud-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  value = '';
  page = 1;
  displayedColumns: string[] = ['name', 'sku', 'price'];

  dataSource: MatTableDataSource<Product>;
  products: Product[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private authService: AuthServiceService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkLogIn();
    this.fetchProducts();
  }

  fetchProducts(){
    this.productService.getProducts().subscribe(
      res => {
        this.products = res;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  checkLogIn(){
    if(!this.authService.isLogedIn()){
      this.router.navigate(['']);
    }
  }

  buttonLogoutHandle(){
    this.authService.logout();
    this.router.navigate(['']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addProduct(){
    const createDialog = this.dialog.open(CrudProductComponent, {
      height: '75%',
      width: '80%',
      data: {
        action: "CREATE",
        product: new Product(),
      },
      disableClose: true,
    });

    createDialog.afterClosed().subscribe(
      result => {
        this.productService.getProductById(result.data.id).subscribe(        
          createdProduct => {
            if (createdProduct !== null) {
              this.products.push(createdProduct);
              this.dataSource.data = this.products;
            }
          }
        );
      }
    );
  }

  afterClose(result: any) {
    const product = result.data;
    if (result.action === "VIEW") {
      const productIndex = this.products.map(p => p.id).indexOf(product.id);
      this.products[productIndex] = product;
      this.dataSource.data = this.products;
    } else if (result.action === "DELETE") {
      const productIndex = this.products.indexOf(product);
      if (productIndex !== -1) {
        this.products.splice(productIndex, 1);
        this.dataSource.data = this.products;
      }
    }
  }

  viewDetail(product: Product) {
    const viewDialog = this.dialog.open(CrudProductComponent, {
      height: '75%',
      width: '80%',
      data: {
        action: "VIEW",
        product,
      },
      disableClose: true,
    });

    viewDialog.afterClosed().subscribe(
      result => {
        this.afterClose(result);
      }
    );
  }
}
