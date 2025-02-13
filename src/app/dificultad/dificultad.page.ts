import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
  IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem } from '@ionic/angular/standalone';
  import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dificultad',
  templateUrl: './dificultad.page.html',
  styleUrls: ['./dificultad.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
    IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem, FormsModule, CommonModule]
})
export class DificultadPage implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {}

  facilClick() {
    console.log("Dificultad fácil");
    this.router.navigate(['/preguntas']);
  }

  mediaClick() {
    console.log("Dificultad media");
    this.router.navigate(['/preguntas']);
  }

  dificilClick() {
    console.log("Dificultad difícil");
    this.router.navigate(['/dificil']);
  }
}
