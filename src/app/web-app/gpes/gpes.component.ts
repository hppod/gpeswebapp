import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-gpes',
  templateUrl: './gpes.component.html',
  styleUrls: ['./gpes.component.css']
})
export class GpesComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
    setLastUrl(this._router.url)
  }

}
