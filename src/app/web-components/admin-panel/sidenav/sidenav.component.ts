import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "./../../../shared/services/authentication.service"

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(
    private _service: AuthenticationService
  ) { }

  ngOnInit() {
  }

  get isAdmin() {
    return this._service.isAdmin
  }

}
