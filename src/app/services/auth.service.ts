import { Injectable, inject } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, authState } from '@angular/fire/auth';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth = inject(Auth);
  authState$: Observable<User|null> = authState(this.auth);
  user: User | null = null;

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(username: string, email: string, password: string) {
    const response = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(response.user, { displayName: username, });
  }

  async logout() {
    await this.auth.signOut();
  }
}
