import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Heroi, HeroiService } from '../../services/heroi.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './herois.component.html',
  styleUrls: ['./herois.component.css']
})
export class HeroisComponent implements OnInit {

  herois: Heroi[] = [];

  constructor(private heroiService: HeroiService) {}

  ngOnInit(): void {
    this.heroiService.listarHerois().subscribe((data: any) => {
      console.log('Heróis recebidos:', data);
      this.herois = data._embedded?.heroiVoes || [];
    }, error => {
      console.error('Erro ao buscar heróis:', error);
    });
  }

}
