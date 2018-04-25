import { Component } from '@angular/core';
import { Service } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public fileInput: any;
  public files: any;
  public allDocuments: any;
  public showDocuments: any[];
  public owner: string;
  public directoryName: string;
  public folder: string;
  public rootFolder: string;
  constructor(private service: Service) {
    this.owner = 'Poonam';
    this.rootFolder = 'uploads';
    this.folder = this.rootFolder;
    this.showDocuments = [];
  }

  ngOnInit() {
    this.getAllDocuments();
  }

  upload(event: any) {
    this.files = event.target.files;
    console.log(parseInt(this.files[0].size) > 5242880);
    if (parseInt(this.files[0].size) > 5242880) {
      console.log("aya");

    }
    const formData = new FormData();
    formData.append('file', this.files[0]);
    console.log('files: ', this.files);
    this.service.upload(formData, this.owner, this.folder).subscribe((response) => {
      console.log('response: ', response);
      if (response.status === 200) {
        console.log('successfully added');
        this.getAllDocuments();
      }
    });
  }

  getAllDocuments() {
    this.service.getAllDocuments().subscribe((response) => {
      this.allDocuments = JSON.parse(response._body);
      this.showDocuments = [];
      this.allDocuments.forEach((element: any) => {
        let parentFolder = element.path.substr(0, element.path.lastIndexOf('/'));
        console.log(parentFolder, this.folder);
        if (parentFolder === this.folder) {
          this.showDocuments.push(element);
        }
      });
    });
  }

  createDirectory() {
    console.log('component m: ', this.directoryName);
    this.service.createDirectory(this.directoryName, this.owner, this.folder).subscribe((response) => {
      console.log("response", response);
      if (response.status == 200) {
        this.directoryName = '';
        this.getAllDocuments();
      }
    });
  }

  openFolder(name: any, type: any) {
    if(type=='Folder'){
    if (this.folder == this.rootFolder) {
      this.folder = this.rootFolder + '/' + name;
    } else {
      this.folder = this.folder + '/' + name;
    }
    this.getAllDocuments();
  }
}
}
