import { HttpClient } from '@angular/common/http';
import { Injectable, PACKAGE_ROOT_URL } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public http: HttpClient) { }
  loggedIn: any;
  
   baseUrl = "http://localhost/HomeSeek/api/";
  
  private subject = new Subject<any>(); // For Realtime prevent refreshing && Pulling data automactically

  sendApiRequest(method: any, data: any) {
    return <any>(
      this.http.post(this.baseUrl + method, btoa(JSON.stringify(data)))
    );
  }

  sendApiRequestForUpdate(method: any, data: any, condition: any) {
    return <any>(
      this.http.post(
        this.baseUrl + method + condition,
        btoa(JSON.stringify(data))
      )
    );
  }

  getUpdate():Observable<any> { // For Constructor realtime pulling
    return this.subject.asObservable();
  }

  sendUpdate(message: string) {
    this.subject.next({ text: message });
  }

  isLoggedIn(): boolean {
    this.loggedIn = localStorage.getItem('isLoggedIn');
    return this.loggedIn;
  }

  setLogin(): void {
    localStorage.setItem('isLoggedIn', "true");
    this.loggedIn = localStorage.getItem('isLoggedIn');
  }
}
