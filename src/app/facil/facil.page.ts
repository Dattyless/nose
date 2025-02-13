import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
  IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem } from '@ionic/angular/standalone';
  import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-facil',
  templateUrl: './facil.page.html',
  styleUrls: ['./facil.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
    IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem, FormsModule, CommonModule]
})
export class FacilPage implements OnInit {
  private preguntas: any[] = [];
  preguntaActual: any = null;
  seleccion = '';
  progreso = 0;
  progresoVisual = 7;
  vidasRestantes = 3;
  preguntasUsadas = new Set<number>();

  private sonidoCorrecto = new Audio('/assets/sounds/correcto.mp3');
  private sonidoIncorrecto = new Audio('/assets/sounds/incorrecto.mp3');

  constructor(private router: Router, private toastController: ToastController, private http: HttpClient) {}

  ngOnInit() {
    this.obtenerPreguntas();
  }

  iniciarJuego() {
    this.vidasRestantes = 3;
    this.preguntasUsadas.clear();
    this.seleccion = '';
    localStorage.removeItem('estadoJuego');
    this.obtenerNuevaPregunta();
  }

  obtenerPreguntas() {
    this.http.get<any[]>('http://localhost:3000/preguntas_facil').subscribe((response) => {
      this.preguntas = response;
      console.log('Preguntas cargadas:', this.preguntas);
      this.iniciarJuego();
    }, (error) => {
      console.error('error al obtener preguntas:', error);
    });
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

    this.preguntaActual.opciones = [
      this.preguntaActual.opcion1,
      this.preguntaActual.opcion2,
      this.preguntaActual.opcion3,
      this.preguntaActual.opcion4,
    ];

    this.seleccion = '';
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

    if (this.progreso >= 7) {
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
