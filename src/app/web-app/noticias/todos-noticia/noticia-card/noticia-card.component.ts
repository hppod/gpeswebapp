import { Component, OnInit, Input } from '@angular/core';
import { Noticia } from "../../../../shared/models/noticia.model"

@Component({
  selector: 'app-noticia-card',
  templateUrl: './noticia-card.component.html',
  styleUrls: ['./noticia-card.component.css']
})
export class NoticiaCardComponent implements OnInit {

  @Input() noticia: Noticia[]
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
