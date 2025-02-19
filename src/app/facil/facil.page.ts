import { Component, OnInit,Inject } from '@angular/core';
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
  selector: 'app-facil',
  templateUrl: './facil.page.html',
  styleUrls: ['./facil.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
    IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem, FormsModule, CommonModule]
})

export class FacilPage implements OnInit {
  public preguntas: any[] = [];
  public preguntaActual: any = null;
  public seleccion = '';
  public progreso = 0;
  public progresoVisual = 7;
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
    private auth: AuthService
  ) {}
  
  ngOnInit() {
    this.obtenerPreguntas();
    this.auth.user$.subscribe((data) => {
      this.user = data;
      this.loadUser();
    });
  }
  
  loadUser() {
    this.http.get(`https://back-d2w7.onrender.com/usuarios/${this.user.email}`).subscribe(
      (response: any) => {}
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
    this.vidasRestantes = 2;
    this.preguntasUsadas.clear();
    this.seleccion = '';
    this.progreso = 0;
    this.progresoVisual = 5;
    localStorage.removeItem('estadoJuego');
    this.obtenerNuevaPregunta();
  }
  
  obtenerPreguntas() {
    this.http.get<any[]>('https://back-d2w7.onrender.com/preguntas_faciles').subscribe(
      (response) => {
        this.preguntas = response;
        this.iniciarJuego();
      },
      (error) => {}
    );
  }
  

  obtenerNuevaPregunta() {
    if (this.progreso >= 5) {
      console.log("Intentando reproducir sonido de victoria...");
      
      this.sonidoWin.play()
        .then(() => {
          console.log("Sonido reproducido correctamente.");
          setTimeout(() => {
            this.router.navigate(['/gamewon']);
          }, 1500);
        })
        .catch((error) => console.error("Error al reproducir el sonido:", error));
    
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
  
    setTimeout(() => {
      this.seleccion = '';
    }, 100);
  }
  
  async responder() {
    if (!this.seleccion) {
      return;
    }
  
    const esCorrecto = this.seleccion.toString().trim() === this.preguntaActual.respuesta_correcta.toString().trim();
  
    if (esCorrecto) {
      this.progreso++;
      this.progresoVisual--;
      this.sonidoCorrecto.play();
      this.actualizarPuntosUsuario(this.user.email, 1);
    } else {
      this.vidasRestantes--;
      this.sonidoIncorrecto.play();
    }
  
    await this.mostrarMensaje(esCorrecto ? '¡Correcto!' : '¡Incorrecto!');
  
    if (this.progreso >= 5) {
      await this.router.navigate(['/gamewon']);
      this.sonidoWin.play();
      return;
    }
  
    if (this.vidasRestantes === 0) {
      await this.router.navigate(['/gameover']);
      return;
    }
  
    setTimeout(() => {
      this.obtenerNuevaPregunta();
    }, 1000);
  }
  
  actualizarPuntosUsuario(email: string, puntos: number) {
    this.http.post(`https://back-d2w7.onrender.com/usuarios/${email}/puntos`, { puntos }).subscribe(
      (response) => {},
      (error) => {}
    );
  }
  
  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }  
}