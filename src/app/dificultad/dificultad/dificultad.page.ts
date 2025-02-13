import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dificultad',
  templateUrl: './dificultad.page.html',
  styleUrls: ['./dificultad.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class DificultadPage implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
  }
    
  facilClick() {
    console.log("Dificultad facil");
    const botonFacil = document.getElementById('botonFacil') as HTMLIonButtonElement;
    if (botonFacil) {
      alert(' ¿Tan malo eres?');
      botonFacil.disabled = true;
    }
  }
  
  mediaClick() {
    console.log("Dificultad media");
  }
  
  dificilClick() {
    console.log("Dificultad dificil");
  }

}
