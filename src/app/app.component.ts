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
  public errorMessage: string;
  public successMessage: string;

  constructor(private service: Service) {
    this.owner = 'Poonam';
    this.rootFolder = 'uploads';
    this.folder = this.rootFolder;
    this.showDocuments = [];
    this.errorMessage = '';
    this.successMessage = '';
  }

  ngOnInit() {
    this.getAllDocuments();
  }

  upload(event: any) {
    this.files = event.target.files;
    console.log(parseInt(this.files[0].size) > 5242880);
    if (parseInt(this.files[0].size) > 5242880) {
      console.log("aya");
      this.errorMessage = 'File size is too big. Please upload file less than 5MB.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      return;
    }
    const formData = new FormData();
    formData.append('file', this.files[0]);
    console.log('files: ', this.files);
    this.service.upload(formData, this.owner, this.folder).subscribe((response) => {
      console.log('response: ', response);
      if (response.status === 200) {
        console.log('successfully added');
        this.successMessage = 'File successfully uploaded.';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

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
        this.successMessage = 'Folder created.';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        this.getAllDocuments();
      }
    });
  }

  openFolder(name: any, type: any) {
    if (type == 'Folder') {
      if (this.folder == this.rootFolder) {
        this.folder = this.rootFolder + '/' + name;
      } else {
        this.folder = this.folder + '/' + name;
      }
      this.getAllDocuments();
    }
  }
}
