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
  public url: string = 'http://localhost:3000';
  public usuario: any

  ngOnInit() {  
    this.auth.user$.subscribe((data) =>{
      this.user = data
      console.log(this.user)
      const Data = {
        id: this.user.email,
        nombre: this.user.name,
      }
      this.http.post(`${this.url}/usuarios`, Data).subscribe((response) => {
        console.log("Cargando o creando datos"); 
        console.log(response);
      this.usuario = response
      console.log(this.usuario.id)
      });

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