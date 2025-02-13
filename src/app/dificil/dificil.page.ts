import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
  IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-dificil',
  templateUrl: './dificil.page.html',
  styleUrls: ['./dificil.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
    IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem, FormsModule, CommonModule],
})
export class DificilPage implements OnInit {
  private preguntas: any[] = [];
  preguntaActual: any = null;
  seleccion = '';
  progreso = 0;
  progresoVisual = 5;
  vidasRestantes = 3;
  preguntasUsadas = new Set<number>();

  private sonidoCorrecto = new Audio('/assets/sounds/correcto.mp3');
  private sonidoIncorrecto = new Audio('/assets/sounds/incorrecto.mp3');

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private auth: AuthService,
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient
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
    this.vidasRestantes = 3;
    this.progreso = 0;
    this.progresoVisual = 5;
    this.preguntasUsadas.clear();
    this.seleccion = '';
    localStorage.removeItem('estadoJuego');
    this.obtenerNuevaPregunta();
  }

  obtenerPreguntas() {
    this.http.get<any[]>('http://localhost:3000/preguntas_imposible').subscribe(
      (response) => {
        this.preguntas = response;
        this.iniciarJuego();
      },
      (error) => {
        console.error('Error al obtener preguntas:', error);
      }
    );
  }

  obtenerNuevaPregunta() {
    if (this.preguntasUsadas.size >= this.preguntas.length) {
      this.router.navigate(['/gamewon']);
      return;
    }

    let indice;
    do {
      indice = Math.floor(Math.random() * this.preguntas.length);
    } while (this.preguntasUsadas.has(indice));

    this.preguntasUsadas.add(indice);
    this.preguntaActual = this.preguntas[indice];

    this.preguntaActual.opciones = this.mezclarArray([
      this.preguntaActual.opcion1,
      this.preguntaActual.opcion2,
      this.preguntaActual.opcion3,
      this.preguntaActual.opcion4,
    ]);

    this.seleccion = '';
  }

  mezclarArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async responder() {
    const esCorrecto = this.seleccion === this.preguntaActual.respuesta_correcta;

    if (esCorrecto) {
      this.progreso++;
      this.progresoVisual--;
      this.sonidoCorrecto.play();
    } else {
      this.vidasRestantes--;
      this.sonidoIncorrecto.play();
    }

    await this.mostrarMensaje(esCorrecto ? '¡Correcto!' : '¡Incorrecto!');

    if (this.progreso >= 5) {
      await this.router.navigate(['/gamewon']);
      return;
    }

    if (this.vidasRestantes === 0) {
      await this.router.navigate(['/gameover']);
      return;
    }

    this.obtenerNuevaPregunta();
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }


}
