import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UnknownComponent } from './components/unknown/unknown.component';
import { TripsComponent } from './pages/trips/trips.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { HistoryComponent } from './pages/history/history.component';
import { CartComponent } from './pages/cart/cart.component';
import { AuthGuard } from '@angular/fire/auth-guard';

export const routes: Routes = [
    { 
      path: 'home',
      component: HomeComponent,
      title: 'Trip Consultor',
      data: { preload: false },
    },
    { 
      path: 'about',
      component: HomeComponent,
      title: 'About Us',
      data: { preload: false },
    },
    { 
      path: 'trips',
      component: TripsComponent,
      title: 'Trips',
      data: { preload: false },
    },
    {
      path: 'trips/:id',
      component: TripsComponent,
      title: 'Trip Detail',
      data: { preload: false },
    },
    { 
      path: 'admin',
      component: AdminComponent,
      title: 'Admin',
      data: { preload: false },
    },
    { 
      path: 'history',
      component: HistoryComponent,
      title: 'History',
      data: { preload: false },
    },
    { 
      path: 'cart',
      component: CartComponent,
      title: 'Cart',
      data: { preload: false },
    },
    { 
      path: 'login',
      component: LoginComponent,
      title: 'Login',
      data: { preload: false },
    },
    { 
      path: '', 
      redirectTo: '/trips', 
      pathMatch: 'full', 
    },
    { 
      path: '**', 
      component: UnknownComponent,
      title: '404 - Page not found',
    }
  ];
