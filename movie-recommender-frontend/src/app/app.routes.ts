import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { WishListComponent } from './wish-list/wish-list.component';
import {MovieDetailsPageComponent} from "./movie-details-page/movie-details-page.component";
import {MovieBrowserComponent} from "./movie-browser/movie-browser.component";
import {MovieRecommenderPageComponent} from "./movie-recommender-page/movie-recommender-page.component";

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'wishList', component: WishListComponent },
    { path: 'movie/:id', component: MovieDetailsPageComponent },
    { path: 'moviesBrowser', component: MovieBrowserComponent},
    { path: 'recommend', component: MovieRecommenderPageComponent},
    { path: '', component: HomePageComponent}
];
