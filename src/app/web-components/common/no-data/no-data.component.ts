import { Component, OnInit, Input } from '@angular/core';
import { AnimationOptions } from "ngx-lottie"

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css']
})
export class NoDataComponent implements OnInit {

  @Input() message: string
  @Input() condition: any

  options: AnimationOptions = {
    path: 'assets/animations/sad.json',
    autoplay: true,
    loop: false
  }

  styles: Partial<CSSStyleDeclaration> = {
    display: 'block',
    marginTop: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  constructor() { }

  ngOnInit() {
  }

}
