import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core"
import { FileSnippet } from "./FileSnippet.class"
import { FileUploaderService } from "./file-uploader.service"
import { ToastrService } from "ngx-toastr"

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {

  @Input() files: FileSnippet[] = new Array()
  fileType: string
  deleteMessage: string
  @Input() limitOnOne: boolean = false
  @Input() fileAccept: string
  @Output('uploaded') uploaded: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private uploaderService: FileUploaderService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.fileAccept == 'images') {
      this.fileType = '.jpg, .jpeg, .jfif, .png'
      this.deleteMessage = 'Excluir imagem'
    } else if (this.fileAccept == 'document') {
      this.limitOnOne = true
      this.fileType = '.pdf'
      this.deleteMessage = 'Excluir arquivo'
    }
  }

  uploadFile(event) {
    if (this.limitOnOne && this.files.length == 1) {
      this.showToastrError('Não é possível adicionar mais de um arquivo!')
    } else {
      for (let index = 0; index < event.length; index++) {
        let file: File = event[index]
        let reader = new FileReader()

        reader.addEventListener('load', (event: any) => {
          if (this.fileAccept == 'images') {
            let image = new FileSnippet(event.target.result, file)
            this.files.push(image)
          } else {
            let document = new FileSnippet(event.target.result, file)
            document.src = "./../../../../assets/img/file-uploader/document.png"
            this.files.push(document)
            this.uploaded.emit(true)
          }
        })

        reader.readAsDataURL(file)
        this.uploaderService.updateSelectedFiles(this.files)
      }
    }
  }

  select(index: number) {
    this.uploaderService.updateMainFile(index)
  }

  isActive(index: number) {
    return this.uploaderService.mainFile === index
  }

  deleteAttachment(index: number) {
    this.files.splice(index, 1)
    this.uploaderService.updateSelectedFiles(this.files)
    if (this.isActive(index)) {
      this.select(0)
    } else {
      if (this.uploaderService.mainFile > index) {
        this.select(this.uploaderService.mainFile - 1)
      }
    }
  }

  showToastrError(message: string) {
    this._toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
