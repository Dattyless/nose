import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet, IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet, IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem, FormsModule, CommonModule]
})
export class PreguntasPage implements OnInit {
  private preguntas: any[] = [];
  preguntaActual: any = null;
  seleccion = '';
  progreso = 0;
  progresoVisual = 7;
  vidasRestantes = 3;
  preguntasUsadas = new Set<number>();

  private sonidoCorrecto = new Audio('/assets/sounds/correcto.mp3');
  private sonidoIncorrecto = new Audio('/assets/sounds/incorrecto.mp3');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private toastController: ToastController, 
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.obtenerPreguntas();
  }

  logout() {
    this.auth.logout({
      logoutParams: { 
        returnTo: this.document.location.origin 
      }
    });
  }

  iniciarJuego() {
    console.log("Juego iniciado");
    this.vidasRestantes = 3;
    this.preguntasUsadas.clear();
    this.seleccion = '';
    this.progreso = 0;
    this.progresoVisual = 7;
    localStorage.removeItem('estadoJuego');
    this.obtenerNuevaPregunta();
  }

  obtenerPreguntas() {
    this.http.get<any[]>('https://back-d2w7.onrender.com/preguntas_medias').subscribe((response) => {
      this.preguntas = response;
      console.log('Preguntas cargadas:', this.preguntas);
      this.iniciarJuego();
    }, (error) => {
      console.error('Error al obtener preguntas:', error);
    });
  }

  obtenerNuevaPregunta() {
    if (this.preguntasUsadas.size >= this.preguntas.length) {
      console.log("Juego ganado");
      this.router.navigate(['/gamewon']);
      return;
    }

    let indice;
    do {
      indice = Math.floor(Math.random() * this.preguntas.length);
    } while (this.preguntasUsadas.has(indice));

    this.preguntasUsadas.add(indice);
    this.preguntaActual = { ...this.preguntas[indice] };

    this.preguntaActual.opciones = [
      this.preguntaActual.opcion1,
      this.preguntaActual.opcion2,
      this.preguntaActual.opcion3,
      this.preguntaActual.opcion4,
    ];

    console.log("Nueva pregunta asignada:", this.preguntaActual);

    setTimeout(() => {
      this.seleccion = '';
    }, 100);
  }

  async responder() {
    console.log("Respuesta seleccionada:", this.seleccion);
    if (!this.seleccion) {
      console.warn("No se seleccionó ninguna respuesta.");
      return;
    }

    console.log("Respuesta correcta:", this.preguntaActual.respuesta_correcta);
    const esCorrecto = this.seleccion.toString().trim() === this.preguntaActual.respuesta_correcta.toString().trim();

    if (esCorrecto) {
      this.progreso++;
      this.progresoVisual--;
      this.sonidoCorrecto.play();
    } else {
      this.vidasRestantes--;
      this.sonidoIncorrecto.play();
    }

    await this.mostrarMensaje(esCorrecto ? '¡Correcto!' : '¡Incorrecto!');

    if (this.progreso >= 7) {
      console.log("Juego ganado, navegando a /gamewon");
      await this.router.navigate(['/gamewon']);
      return;
    }

    if (this.vidasRestantes === 0) {
      console.log("Juego perdido, navegando a /gameover");
      await this.router.navigate(['/gameover']);
      return;
    }

    setTimeout(() => {
      console.log("Cargando nueva pregunta...");
      this.obtenerNuevaPregunta();
    }, 1000);
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000,
      position: 'top',
    });
    toast.present();
  }
}
