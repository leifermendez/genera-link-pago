import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) {
  }

  getOrderDetail(id: string): Observable<any> {
    return this.http.get(`${environment.api}/orders/${id}`)
  }

  sendPayment(token: string, id: string): Promise<any> {
    return this.http.patch(`${environment.api}/orders/${id}`,
      {
        token
      }).toPromise()
  }

  generateOrder(data: { name: string, amount: number }): Observable<any> {
    return this.http.post(`${environment.api}/orders`, data)
  }

  confirmOrder(id:string): Promise<any> {
    return this.http.patch(`${environment.api}/orders/confirm/${id}`, {}).toPromise()
  }
}
