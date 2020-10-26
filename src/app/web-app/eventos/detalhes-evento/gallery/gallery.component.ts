import { Component, OnInit, Input } from '@angular/core';
import { Lightbox, IAlbum } from "ngx-lightbox"

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {

  @Input() images: Array<IAlbum>

  constructor(
    private _lightbox: Lightbox
  ) { }

  ngOnInit() {
  }

  open(index: number) {
    this._lightbox.open(this.images, index)
  }

  close() {
    this._lightbox.close()
  }
}
