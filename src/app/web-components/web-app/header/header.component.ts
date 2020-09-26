import { Component, OnInit } from "@angular/core"
import { Router, NavigationEnd } from "@angular/router"
import { GoogleAnalyticsService } from "./../../../shared/services/google-analytics.service"
import { __event_login, __category_institucional, __action_login } from "./../../../shared/helpers/analytics.consts"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  url: string
  public isCollapsed = true

  constructor(private router: Router, private _analytics: GoogleAnalyticsService) {
    router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.url = route.url
      }
    })
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true
    })
  }

  sendEventToAnalytics() {
    this._analytics.eventEmitter(__event_login, __category_institucional, __action_login)
  }

}
