import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { AuthenticationService } from "./../../../shared/services/authentication.service"

@Component({
  selector: 'app-header-admin',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userLogged: string
  stateSidebar: boolean = true;

  constructor(
    private _router: Router,
    private _service: AuthenticationService
  ) { }

  ngOnInit() {
    this.userLogged = sessionStorage.getItem('currentUsername')
  }

  openCloseSidebar() {
    if (this.stateSidebar) {
      document.querySelector("body").setAttribute("class", "g-sidenav-show nav-open g-sidenav-pinned");
    }
    else {
      document.querySelector("body").removeAttribute("class");
      document.querySelector("body").setAttribute("class", "g-sidenav-show g-sidenav-hidden");
    }
    this.stateSidebar = !this.stateSidebar
  }

  logout() {
    this._service.logout()
    this._router.navigate(['/admin/auth/login'])
  }

}
