import { Component, OnInit, Input } from '@angular/core'
import { LottieAnimationViewModule } from "ng-lottie"

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input() condition: any
  lottieConfig: any

  constructor() {
    LottieAnimationViewModule.forRoot()
    this.lottieConfig = {
      path: 'assets/animations/loading.json',
      autoplay: true,
      loop: true
    }
  }

  ngOnInit() {
  }

}
