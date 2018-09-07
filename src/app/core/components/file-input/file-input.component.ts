import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css']
})
export class FileInputComponent implements OnInit {

  @Input() title: string;
  @Output() fileChange = new EventEmitter<File>()

  file: File;
  dragOver: boolean;

  constructor() { }

  ngOnInit() {
  }

  dragOverFileInput(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dragOver = true;
  }

  dragLeaveFileInput() {
    event.stopPropagation();

    this.dragOver = false;
  }

  fileDropped(event) {
    event.preventDefault();
    event.stopPropagation();

    let file = event.dataTransfer.files[0];
    this.file = file;

    this.fileChange.emit(file);

    this.dragOver = false;
  }

  fileSelected(event) {
    let file = event.srcElement.files[0];
    this.file = file;

    this.fileChange.emit(file);
  }
}
