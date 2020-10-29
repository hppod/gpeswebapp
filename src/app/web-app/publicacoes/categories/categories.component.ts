import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { PublicacoesHelperService } from "./../publicacoes-helper.service"
import { Category } from 'src/app/shared/models/category.model';
import { CategoryService } from 'src/app/shared/services/categories.service';
import { ToastrService } from "ngx-toastr"

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  private httpReq: Subscription
  categoryMenuItems: Category[] = new Array()
  isLoading: boolean = false

  constructor(
    private _helperService: PublicacoesHelperService,
    private _router: Router,
    private categoryService: CategoryService,
    private _toastr: ToastrService,
  ) { }

  ngOnInit() {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    this.getCategories()
  }

  getCategories() {
    this.isLoading = true
    this.httpReq = this.categoryService.getExistingCategories(false).subscribe(response => {
      this.isLoading = false
      this.categoryMenuItems = response.body['data']
    }, err => {
      this.showToastrError(`${err.error['message']}`)
    })
  }

  setParamsToSearch(item: any) {
    this._helperService.categorySelectedItem = item
    this._helperService.categorySelectedTitle = item['nome']
    this._helperService.setParamToCategory()
  }

  /**Função que navega para os documentos de acordo com a categoria. */
  navigateToDocs(item: any) {
    this.setParamsToSearch(item)
    this._router.navigate(['institucional/publicacoes/arquivos'])
  }

  /**Função para exibir um toastr de erro. */
  showToastrError(message: string) {
    this._toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}