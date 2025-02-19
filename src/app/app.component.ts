import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
  IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem } from '@ionic/angular/standalone';
  import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
    IonMenuButton, IonMenuToggle, IonListHeader, IonButtons, IonButton, IonRadioGroup, IonRadio, IonItem, FormsModule, HttpClientModule, RouterLink, RouterLinkActive],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },




  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {
    addIcons( icons );
  }
}
