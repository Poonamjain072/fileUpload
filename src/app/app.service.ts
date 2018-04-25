import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class Service {
    public baseURL = 'http://localhost:8080';
    constructor(private http: Http) {

    }

    private handleError(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.status);
    }

    getAllDocuments(): Observable<any> {
        return this.http.get(`${this.baseURL}/api/getAllDocuments`)
            .map(success => success)
            .catch(this.handleError);
    }

    upload(formData: any, owner: any, folder: any) {
        console.log('service: ', formData, owner, folder);
        let headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        return this.http.post(`${this.baseURL}/api/upload?owner=` + owner + '&folder=' + folder, formData)
            .map((success) => success)
            .catch(this.handleError);
    }

    createDirectory(name: String, owner: String, folder: string) {
        console.log("name: ", name, 'owner: ', owner);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(`${this.baseURL}/api/createDirectory?name=` + name + '&owner=' + owner + '&folder=' + folder, headers)
            .map((success) => success)
            .catch(this.handleError);
    }
}
