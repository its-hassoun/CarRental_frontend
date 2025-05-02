import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Ajouter Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  passwordVisible = false;
  loginError: string | null = null;
  showErrorPopup = false;
  showSuccessPopup = false;
  successMessage = "Login successful! Welcome back.";

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  togglePasswordVisibility = () => {
    this.passwordVisible = !this.passwordVisible;
  };

  onSubmit() {
    this.submitted = true;
    this.loginError = null;
    this.showErrorPopup = false;
    this.showSuccessPopup = false;

    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      fetch('http://localhost:9999/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then(data => {
        console.log('Login successful:', data);
      
        // Simuler un token fictif (non sécurisé, à éviter en prod)
        const fakeToken = btoa(JSON.stringify({ role: data.role }));
      
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', fakeToken);
      
        const payload = JSON.parse(atob(fakeToken));
        localStorage.setItem('role', payload.role);
      
        this.showSuccessPopup = true;
      
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 200);
      })
      
      .catch(error => {
        console.error('Error:', error);
        this.loginError = 'Invalid email or password. Please try again.';
        this.showErrorPopup = true;
        setTimeout(() => {
          this.showErrorPopup = false;
        }, 3000); 
      });
    }
  }
}
