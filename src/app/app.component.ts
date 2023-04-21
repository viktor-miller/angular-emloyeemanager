import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee/types/employee";
import {EmployeeService} from "./employee/service/employee.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public employees: Employee[] = []
  public currentEmployee: Employee | null = null
  public searchQueryUpdate: Subject<Event> = new Subject<Event>()

  constructor(private employeeService: EmployeeService) {
    // init search Observable
    this.searchQueryUpdate
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((e: Event): void => {
        const target: HTMLInputElement = e.target as HTMLInputElement

        this.loadEmployees(target.value)
      })
  }

  ngOnInit() {
    this.loadEmployees()
  }

  public loadEmployees(query: string = ""): void {
    this.employeeService.getEmployees(query).subscribe({
      next: (e: Employee[]): void => {
        this.employees = e
      },
      error: (e: HttpErrorResponse): void => alert(e.message)
    })
  }

  public onAddEmployee(form: NgForm): void {
    this.employeeService.addEmployee(form.value).subscribe({
      next: (e: Employee): void => {
        this.loadEmployees()

        form.resetForm()
        document.getElementById('add-employee-form')?.click()
      },
      error: (e: HttpErrorResponse) => {
        alert(e.message)
        form.resetForm()
      }
    })
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (e: Employee): void => {
        this.loadEmployees()

        document.getElementById('update-employee-form')?.click()
      },
      error: (e: HttpErrorResponse) => alert(e.message)
    })
  }

  public onDeleteEmployee(id: number | undefined): void {
    if (! id) {
      return
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: (e: void): void => {
        this.loadEmployees()

        document.getElementById('delete-employee-form')?.click()
      },
      error: (e: HttpErrorResponse) => alert(e.message)
    })
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container')
    let button = document.getElementById('modal-trigger')

    if (!button) {
      button = document.createElement('button')
      // @ts-ignore
      button.type = 'button'
      button.style.display = 'none'
      button.setAttribute('data-toggle', 'modal')
      button.setAttribute('id', 'modal-trigger')

      // @ts-ignore
      container.appendChild(button)
    }

    this.currentEmployee = employee

    switch(mode) {
      case 'add':
        button.setAttribute('data-target', '#addEmployeeModal')
        break;
      case 'edit':
        button.setAttribute('data-target', '#updateEmployeeModal')
        break;
      case 'delete':
        button.setAttribute('data-target', '#deleteEmployeeModal')
        break;
    }

    button.click();
  }
}
