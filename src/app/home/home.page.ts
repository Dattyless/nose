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
  db_user: any; 
  public user: any; 
  private url: string = 'https://back-d2w7.onrender.com'; 
  public usuario: any; 

  constructor(
    private auth: AuthService, // Servicio de Auth0
    private navCtrl: NavController, // Controlador de navegación
    private http: HttpClient, // Cliente HTTP para hacer solicitudes al backend
    private router: Router // Router para navegar entre páginas
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((data) => {
      this.user = data; 
      console.log('Usuario de Auth0:', this.user);

      this.loadUser();
    });
  }

  // Cargar el usuario desde la base de datos
  loadUser() {
    this.http.get(`${this.url}/usuarios/${this.user.email}`).subscribe(
      (response: any) => {
        console.log('Respuesta del backend:', response);
  
        if (response.error === 'Usuario no encontrado') {
          // Si el usuario no existe, crearlo
          this.createUser();
        } else {
          // Si el usuario existe, redirigir a la página de dificultad
          this.enter();
        }
      },
      (error) => {
        if (error.status === 404) {
          // Si el usuario no existe, crearlo
          this.createUser();
        } else {
          console.error('Error al cargar el usuario:', error);
          // Manejar otros errores (por ejemplo, mostrar un mensaje al usuario)
        }
      }
    );
  }

  // Crear un nuevo usuario en la base de datos
  createUser() {
    const new_user = {
      email: this.user.email,
      name: this.user.name
    };
  
    this.http.post(`${this.url}/adduser`, new_user).subscribe(
      (response) => {
        console.log('Usuario creado:', response);
        // Redirigir a la página de dificultad después de crear el usuario
        this.enter();
      },
      (error) => {
        console.error('Error al crear el usuario:', error);
        // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
      }
    );
  }

  // Redirigir a la página de dificultad
  enter() {
    console.log('Entrando a contenido');
    this.router.navigate(['/dificultad']);
  }

  // Cerrar sesión y redirigir a la página de inicio de Auth0
  exit() {
    console.log('Saliendo de la aplicación');
  }
}