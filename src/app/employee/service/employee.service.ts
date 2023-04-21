import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Employee} from "../types/employee";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiServiceUrl: string = environment.apiBaseUrl

  constructor(private http: HttpClient) {}

  public getEmployees(query: string = ""): Observable<Employee[]> {
    const params: Array<string> = new Array<string>()

    if (query.length) {
      params.push("query="+ query)
    }

    const paramsStr: string = params.length? "?"+ params.join("&") : ""

    return this.http.get<Employee[]>(`${this.apiServiceUrl}/employee${paramsStr}`)
  }

  public addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiServiceUrl}/employee`, employee)
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiServiceUrl}/employee`, employee)
  }

  public deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServiceUrl}/employee/${id}`)
  }
}
