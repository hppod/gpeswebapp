import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'noSanitizeHtml'
})
export class NoSanitizeHtmlPipe implements PipeTransform {
  constructor(private _domSanitizer: DomSanitizer) {}

  transform(value: string, type: string): SafeHtml {
    switch (type) {
			case 'html':
				return this._domSanitizer.bypassSecurityTrustHtml(value);
			case 'style':
        return this._domSanitizer.bypassSecurityTrustStyle(value);
    }
  }
}
