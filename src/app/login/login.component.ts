import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {


  message = '';
  invalidLogin = false
  form!: FormGroup;
  submitted = false;
  @Input()
  error!: string | null;
  hide = true;
  role: any

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')

    } else {
      localStorage.removeItem('foo')
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  initializeForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  checkLogin() {
    if (this.form.valid) {
      // const { username, password } = this.form.value;
      this.loginService.authenticate(this.form.value).subscribe(
        (userData) => {
          console.log('Authentication successful', userData);
          sessionStorage.setItem('token', userData.accessToken);
          sessionStorage.setItem('username', userData.username);
          sessionStorage.setItem('division', userData.division);
          sessionStorage.setItem('role', userData.role);
          this.router.navigate(['/employee'])
        },
        (error) => {
          console.error('Authentication failed', error);
          this.openSnackBar('Authentication failed', 'Close');
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Snackbar will be displayed for 3 seconds
      horizontalPosition: 'end', // Positions the snackbar horizontally at the end (right side)
      verticalPosition: 'top' // Positions the snackbar vertically at the top
    });
  }

}
