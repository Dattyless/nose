import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
  IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem } from '@ionic/angular/standalone';
  import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
    IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem, FormsModule, CommonModule]
})
export class HomePage implements OnInit {

  constructor(private auth: AuthService, private navCtrl: NavController, private http: HttpClient, private router: Router) { }
  db_user: any;
  public user: any;
  public url: string = 'https://back-d2w7.onrender.com';
  public usuario: any

  ngOnInit() {
    this.auth.user$.subscribe(data => {
      this.user = data
      console.log('user', this.user);

      this.loadUser()
        // createUser();
      });
    }

    loadUser() {
      this.http.get('https://prijecto-final-back-2.onrender.com/users/' + this.user.email).subscribe((response:any) => {
        console.log( response);
        console.log(this.user.email);
        if(response == "not found"){
          this.createUser();
        }
      }); 
    }

    createUser() {

      let new_user = {
        email: this.user.email,
        name: this.user.name
      }

      this.http.post('https://prijecto-final-back-2.onrender.com/add_user', new_user).subscribe((response) => {
        console.log(response);
      });
    }
  enter() {
    console.log('Entrando a contenido');
    this.router.navigate(['/dificultad']);
  }

  exit() {
    console.log('Saliendo de la aplicación');
    const url = ''
  }
  
}