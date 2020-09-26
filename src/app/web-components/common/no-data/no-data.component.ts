import { Component, OnInit, Input } from '@angular/core';
import { LottieAnimationViewModule } from "ng-lottie"

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css']
})
export class NoDataComponent implements OnInit {

  @Input() message: string
  lottieConfig: any

  constructor() {
    LottieAnimationViewModule.forRoot()
    this.lottieConfig = {
      path: 'assets/animations/sad.json',
      autoplay: true,
      loop: false
    }
  }

  ngOnInit() {
  }

}
