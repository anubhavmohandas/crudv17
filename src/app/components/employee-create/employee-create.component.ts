import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NgFor, NgIf } from '@angular/common';
//import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.css',
  providers:[]
})
export class EmployeeCreateComponent {
  submitted = false;
  employeeForm!: FormGroup;
  EmployeeProfile: string[] = ['Finance', 'BDM', 'HR', 'Sales', 'Admin'];
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
  ) {
    this.mainForm();
  }
  ngOnInit() { }
  mainForm() {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      designation: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }
  // Choose designation with select dropdown
  updateProfile(e: string) {
    this.employeeForm.get('designation')?.setValue(e, {
      onlySelf: true,
    });
  }
  // Getter to access form control
  get myForm() {
    return this.employeeForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (!this.employeeForm.valid) {
      return false;
    } else {
      return this.apiService.createEmployee(this.employeeForm.value).subscribe({
        complete: () => {

          console.log('\nEmployee successfully created!'),
          console.log(this.employeeForm.value)
            this.ngZone.run(() => this.router.navigateByUrl('/employees-list'));
        },
        error: (e: any) => { console.log(e); },
      });
    }
  }
}
