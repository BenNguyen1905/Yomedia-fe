import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-crud-product',
  templateUrl: './crud-product.component.html',
  styleUrls: ['./crud-product.component.css']
})
export class CrudProductComponent implements OnInit {
  product: Product = new Product();
  isView = true;
  isCreate = true;
  sourceView: Product = new Product();
  userInputValidations: FormGroup;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CrudProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public productService: ProductService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.product = this.data.product;
    if (this.data.action === "DELETE") {
      this.delete();
    }
    this.isView = this.data.action === "VIEW";
    this.isCreate = this.data.action === "CREATE";
    this.sourceView = Object.assign({}, this.product);
    this.userInputValidations = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
  }

  close() {
    this.dialogRef.close({
      action: "VIEW",
      data: this.product,
    });
  }

  delete() {
    const deleteDialog = this.dialog.open(ConfirmComponent, {
      data: {
        message: 'Do you REALLY want to DELETE this ?',
      },
      disableClose: true,
    });

    deleteDialog.afterClosed().subscribe(
      result => {
        if (result.confirmed) {
          this.productService.deleteProduct(this.product.id).subscribe(
            success => {
              this.dialogRef.close({
                action: "DELETE",
                data: this.product,
              });
            }
          );
        }
      }
    );
  }

  edit() {
    this.isView = false;
  }

  discard() {
    this.isView = true;
    this.sourceView = this.product;
  }

  create() {
    this.productService.createProduct(this.sourceView).subscribe(
      result => {
        this.dialogRef.close({
          data: result
        });
      }
    );
  }

  save() {
    this.productService.updateProduct(this.product.id, this.sourceView).subscribe(
      result => {
        this.isView = true;
        this.product = this.sourceView;
      }
    );
  }
}
