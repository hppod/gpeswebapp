import { Component, OnInit } from '@angular/core';
import { LottieAnimationViewModule } from "ng-lottie"

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  lottieConfig: any

  constructor() {
    LottieAnimationViewModule.forRoot()
    this.lottieConfig = {
      path: 'assets/animations/error.json',
      autoplay: true,
      loop: false
    }
  }

  ngOnInit() {
  }

}
