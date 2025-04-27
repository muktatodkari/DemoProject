import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; //for ngModol
import { CommonModule } from '@angular/common'; // when we add * conditions
import { HttpClientModule } from '@angular/common/http'; //API calling
import { HttpClient } from '@angular/common/http'; //call API in funtion

interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: any
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'DemoProject';
  firstName: any;
  lastName: any;
  email: any;
  formSubmit: boolean = false;
  studentData: User[] = [];
  data: any = ''; 
  updateValue: boolean = false;
  id: any;

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.callApi();
  }

  submit() {
    this.formSubmit = true;
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };
    this.callPostApi(data);
  }

  update(id: any) {
    this.updateValue = true;
    this.studentData.map((value) => {
      if (value.id == id) {
        this.firstName = value.firstName;
        this.lastName = value.lastName;
        this.email = value.email;
        this.id = value.id;
      }
    })
  }

    updatedValue() {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };
    this.updateData(this.id, data);
  }


  next() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
  }

  callApi() {
    this.http.get<User[]>('http://192.168.1.106:3010/getData').subscribe({
      next: (res) => {
        console.log(res), (this.studentData = res);
      },
      error: (err) => console.error(err),
      complete: () => {
        this.next();
      },
    });
  }

  callPostApi(request: any) {
    console.log('request body sent:', request);
    this.http
      .post<any>('http://192.168.1.106:3010/createData', request)
      .subscribe({
        next: (response) => console.log('Success', response),
        error: (error) => console.error('Error', error),
        complete: () => {
          console.log('Completed');
          this.callApi()
        },
      });
  }

  updateData(request: any, updateRequest: any) {
    console.log("updateData", request);
    this.http.put<User[]>(`http://192.168.1.106:3010/updateData/${request}`, updateRequest).subscribe({
      next: (res) => {
        this.data = res
        console.log("successfully Updated", res);
      },
      error: (err) => {
        this.updateValue = false;
        this.next();
        console.log("Error");
      },
      complete: () => {
        this.updateValue = false;
        this.next();
        this.callApi();
      }
    })
  }

  deleteData(id: any) {
    console.log("delete request", id);
    this.http.delete<User[]>(`http://192.168.1.106:3010/deleteData/${id}`).subscribe({
      next: res => {
        this.data = res;
        console.log("successfully Updated", res)
      },
      error(err) {
        console.log("erorr");
      },
      complete: () => {
        this.callApi();
      },
    })
  }
}
