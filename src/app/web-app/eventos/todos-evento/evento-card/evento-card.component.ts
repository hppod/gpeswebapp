import { Component, OnInit, Input } from '@angular/core';
import { Evento } from "../../../../shared/models/evento.model"

@Component({
  selector: 'app-evento-card',
  templateUrl: './evento-card.component.html',
  styleUrls: ['./evento-card.component.css']
})
export class EventoCardComponent implements OnInit {

  @Input() noticia: Evento[]
  hasImage: boolean = false
  mainfile_index: number
  source: any

  constructor() { }

  ngOnInit() {
    if (this.noticia['sources'].length > 0) {
      this.hasImage = true
      this.mainfile_index = this.noticia['mainfile_index']
      this.source = this.noticia['sources'][this.mainfile_index]['src']
    }
  }
}
