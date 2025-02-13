import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // Lista de preguntas con opciones
  private preguntas = [
    {
      pregunta: '¿Cuál es la capital de Francia?',
      opciones: ['París', 'Londres', 'Berlín', 'Madrid'],
      respuestaCorrecta: 'París',
    },
    {
      pregunta: '¿Cuál es el río más largo del mundo?',
      opciones: ['Amazonas', 'Nilo', 'Yangtsé', 'Misisipi'],
      respuestaCorrecta: 'Amazonas',
    },
    {
      pregunta: '¿Cuántos planetas hay en el sistema solar?',
      opciones: ['7', '8', '9', '10'],
      respuestaCorrecta: '8',
    },
  ];

  // Variables del progreso del juego
  progresoCasa: number = 0;
  vidas: number = 3;

  constructor() {}

  // Obtener una pregunta aleatoria
  obtenerPreguntaAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * this.preguntas.length);
    return this.preguntas[indiceAleatorio];
  }

  // Verificar la respuesta seleccionada
  verificarRespuesta(seleccion: string, respuestaCorrecta: string): boolean {
    return seleccion === respuestaCorrecta;
  }

  // Verificar si la casa está completa
  casaCompleta(): boolean {
    return this.progresoCasa >= 5;
  }

  // Verificar si el juego ha terminado
  juegoTerminado(): boolean {
    return this.vidas <= 0;
  }
}