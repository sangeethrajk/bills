import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  form!: FormGroup;
  sendOTPDisable: boolean = false;
  showOTPField: boolean = false;
  verifyOTPDisable: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      otp: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  sendOTP() {
    const username = this.form.get('username')?.value;
    this.authService.resetPassword(username).subscribe(
      (response: any) => {
        console.log(response);
        if (response.message === 'OTP sent to your email address') {
          this.sendOTPDisable = true;
          this.showOTPField = true;
          this.toastService.showToast('success', 'OTP sent to System Admin', '');
        }
      },
      (error: any) => {
        console.error(error);
        if (error.error.message === 'Officer not found') {
          this.toastService.showToast('error', 'Invalid Username', '');
        } else {
          this.toastService.showToast('error', 'Error while sending OTP', '');
        }
      }
    );
  }

  verifyOTP() {
    this.verifyOTPDisable = true;
    const username = this.form.get('username')?.value;
    const otp = this.form.get('otp')?.value;
    const newPassword = this.form.get('newPassword')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    // Check if OTP length is less than 6 characters
    if (otp.length < 6) {
      this.toastService.showToast('warning', 'OTP should be at least 6 characters long', '');
      this.verifyOTPDisable = false; // Re-enable OTP verification button
      return; // Exit function
    }

    // Check if new password is at least 8 characters long
    if (newPassword.length < 8) {
      this.toastService.showToast('warning', 'Password should be at least 8 characters long', '');
      this.verifyOTPDisable = false;
      return;
    }

    // Check if new password matches the confirmation password
    if (newPassword !== confirmPassword) {
      this.toastService.showToast('warning', 'Passwords do not match', '');
      this.verifyOTPDisable = false;
      return;
    }

    // Proceed with OTP verification if all checks pass
    this.authService.verifyOTP(username, otp, newPassword).subscribe(
      (response: any) => {
        console.log(response);
        if (response.message === 'Password updated successfully') {
          this.toastService.showToast('success', 'Password updated successfully', '');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000)
        }
      },
      (error: any) => {
        console.error(error);
        this.verifyOTPDisable = false;
        this.toastService.showToast('error', 'Error while verifying OTP', '');
      }
    );
  }



}
