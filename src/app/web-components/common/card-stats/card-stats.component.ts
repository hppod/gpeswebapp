import { Component, OnInit, Input } from "@angular/core"
import { Data } from "../../../shared/models/analytics/data.model"

@Component({
  selector: 'app-card-stats',
  templateUrl: './card-stats.component.html',
  styleUrls: ['./card-stats.component.css']
})
export class CardStatsComponent implements OnInit {

  @Input() data: Data
  @Input() tooltip: string

  constructor() { }

  ngOnInit() {
    this.tooltip = 'Teste de tooltip'
  }

  convertSeconds(value) {
    let seconds = parseInt(value)
    let time = new Date(0)
    time.setSeconds(seconds)
    let timeString = time.toISOString().substr(11, 8)
    return timeString
  }

  roundFloat(value) {
    return parseFloat(value).toFixed(2)
  }

}
