import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
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
    IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem, FormsModule, CommonModule]
})
export class DificilPage implements OnInit {
  public preguntas: any[] = [];
  public preguntaActual: any = null;
  public seleccion = '';
  public progreso = 0;
  public progresoVisual = 6;
  public vidasRestantes = 3;
  public preguntasUsadas = new Set<number>();
  public user: any;
  private sonidoCorrecto = new Audio('/assets/sounds/correcto.mp3');
  private sonidoIncorrecto = new Audio('/assets/sounds/incorrecto.mp3');
  private sonidoWin = new Audio('/assets/sounds/win.mp3');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Componente DificilPage inicializado');
    this.obtenerPreguntas();
    this.auth.user$.subscribe((data) => {
      this.user = data;
      this.loadUser();
    });
  }

  loadUser() {
    console.log('Cargando usuario:', this.user.email);
    this.http.get(`https://back-d2w7.onrender.com/usuarios/${this.user.email}`).subscribe(
      (response: any) => {
        console.log('Usuario cargado:', response);
      },
      (error) => {
        console.error('Error al cargar el usuario:', error);
      }
    );
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: this.document.location.origin
      }
    });
  }

  iniciarJuego() {
    console.log('Iniciando juego...');
    this.vidasRestantes = 3;
    this.preguntasUsadas.clear();
    this.seleccion = '';
    this.progreso = 0;
    this.progresoVisual = 6;
    localStorage.removeItem('estadoJuego');
    this.obtenerNuevaPregunta();
  }

  obtenerPreguntas() {
    console.log('Obteniendo preguntas...');
    this.http.get<any[]>('https://back-d2w7.onrender.com/preguntas_imposibles').subscribe(
      (response) => {
        console.log('Preguntas obtenidas:', response);
        this.preguntas = response;
        this.iniciarJuego();
      },
      (error) => {
        console.error('Error al obtener preguntas:', error);
      }
    );
  }

  obtenerNuevaPregunta() {
    console.log('Obteniendo nueva pregunta...');
    if (this.preguntasUsadas.size >= this.preguntas.length) {
      console.log('Todas las preguntas han sido usadas, navegando a /gamewon');
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
      this.preguntaActual.opcion4
    ];

    console.log('Nueva pregunta:', this.preguntaActual);
    this.seleccion = ''; // Reinicia la selección para la nueva pregunta
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  async responder() {
    console.log('Respondiendo...');
    if (!this.seleccion) {
      console.log('No se ha seleccionado ninguna opción');
      return;
    }

    console.log('Opción seleccionada:', this.seleccion);
    console.log('Respuesta correcta:', this.preguntaActual.respuesta_correcta);

    const esCorrecto = this.seleccion.toString().trim() === this.preguntaActual.respuesta_correcta.toString().trim();
    console.log('¿Respuesta correcta?', esCorrecto);

    if (esCorrecto) {
      this.progreso++;
      this.progresoVisual--;
      console.log('Progreso actual:', this.progreso);
      this.sonidoCorrecto.play();
      this.actualizarPuntosUsuario(this.user.email, 4);
    } else {
      this.vidasRestantes--;
      console.log('Vidas restantes:', this.vidasRestantes);
      this.sonidoIncorrecto.play();
    }

    await this.mostrarMensaje(esCorrecto ? '¡Correcto!' : '¡Incorrecto!');

    if (this.progreso >= 6) {
      console.log('Juego ganado, navegando a /gamewon');
      await this.router.navigate(['/gamewon']);
      return;
    }

    if (this.vidasRestantes === 0) {
      console.log('Juego perdido, navegando a /gameover');
      await this.router.navigate(['/gameover']);
      return;
    }

    console.log('Obteniendo nueva pregunta...');
    this.obtenerNuevaPregunta(); // Obtener nueva pregunta sin setTimeout
  }

  actualizarPuntosUsuario(email: string, puntos: number) {
    console.log('Actualizando puntos del usuario:', email);
    this.http.post(`https://back-d2w7.onrender.com/usuarios/${email}/puntos`, { puntos }).subscribe(
      (response) => {
        console.log('Puntos actualizados:', response);
      },
      (error) => {
        console.error('Error al actualizar puntos:', error);
      }
    );
  }

  async mostrarMensaje(mensaje: string) {
    console.log('Mostrando mensaje:', mensaje);
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }
}