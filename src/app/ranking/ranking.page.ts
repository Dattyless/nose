import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet, IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { IonAvatar, IonBadge } from '@ionic/angular/standalone';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [ IonAvatar, IonBadge, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet, IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem, FormsModule, CommonModule]

})
export class RankingPage implements OnInit {
  ranking: any[] = [];
  public url: string = 'https://back-d2w7.onrender.com';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.obtenerRanking();
  }

  obtenerRanking() {
    this.http.get(`${this.url}/ranking`).subscribe(
      (response: any) => {
        console.log('Ranking obtenido:', response);
        this.ranking = response; 
      },
      (error) => {
        console.error('Error al obtener el ranking:', error);
      }
    );
  }

  // Redirigir a la página de inicio
  volver() {
    this.router.navigate(['/home']);
  }
}