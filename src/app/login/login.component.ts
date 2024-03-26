import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from '../services/toast.service';

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
  error!: string | null;
  hide = true;
  role: any;
  loginDisable: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: AuthService,
    private snackBar: MatSnackBar,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  checkLogin() {
    if (this.form.valid) {
      this.loginDisable = true;
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
          this.loginDisable = false;
          this.toastService.showToast('error', 'Authentication failed', '');
        }
      );
    } else {
      this.toastService.showToast('error', 'Check Username or Password', '');
    }
  }

}
