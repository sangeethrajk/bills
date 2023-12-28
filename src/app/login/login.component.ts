import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  constructor(private router: Router, private fb: FormBuilder, private loginService: AuthService) { }

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
      password_encrypted: ['', Validators.required]
    })
  }
  checkLogin() {
    if (this.form.valid) {
      const { username, password_encrypted } = this.form.value;
      this.loginService.authenticate(username, password_encrypted, this.role).subscribe(
        (userData) => {

          console.log('Authentication successful', userData);
          this.router.navigate(['/employee'])
        },
        (error) => {

          console.error('Authentication failed', error);
        }
      );
    }
  }



}
