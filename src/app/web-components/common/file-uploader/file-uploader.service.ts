import { Injectable } from "@angular/core"
import { FileSnippet } from "./FileSnippet.class"

@Injectable({
    providedIn: 'root'
})
export class FileUploaderService {

    constructor() { }

    selectedFiles: FileSnippet[] = new Array()
    mainFile: number = 0

    updateSelectedFiles(Files: FileSnippet[]) {
        this.selectedFiles = Files
    }

    updateMainFile(Index: number) {
        this.mainFile = Index
    }

}