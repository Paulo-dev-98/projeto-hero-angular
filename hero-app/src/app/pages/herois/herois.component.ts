import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Heroi, HeroiService } from '../../services/heroi.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './herois.component.html',
  styleUrls: ['./herois.component.css']
})
export class HeroisComponent implements OnInit {

  herois: Heroi[] = [];
  mostrarFormulario: boolean = false;
  editando: boolean = false;

  constructor(private heroiService: HeroiService) {}

  ngOnInit(): void {
    this.heroiService.listarHerois().subscribe((data: any) => {
      console.log('Heróis recebidos:', data);
      this.herois = data._embedded?.heroiVoes || [];
    }, error => {
      console.error('Erro ao buscar heróis:', error);
    });
  }

  novoHeroi: Heroi = {
    nome: '',
    nomeDoHeroi: '',
    dataDeNascimento: '',
    altura: 0,
    peso: 0
  };

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.novoHeroi = {
      nome: '',
      nomeDoHeroi: '',
      dataDeNascimento: '',
      altura: 0,
      peso: 0
    };
  }

  fecharFormulario() {
    this.mostrarFormulario = false;
  }

  salvarHeroi() {
    if (this.editando && this.novoHeroi.id) {
      this.heroiService.atualizarHeroi(this.novoHeroi).subscribe(() => {
        const index = this.herois.findIndex(h => h.id === this.novoHeroi.id);

        if (index !== -1) {
          this.herois[index] = { ...this.novoHeroi };
        }

        this.fecharFormulario();
      });
    } else {
      this.heroiService.cadastrarHeroi(this.novoHeroi).subscribe(
        (heroiSalvo) => {
          this.herois.push(heroiSalvo);
          this.fecharFormulario();
        },
        (erro) => {
          console.error('Erro ao cadastrar herói:', erro);
        }
      );
    }
  }

  editarHeroi(heroi: Heroi) {
    this.mostrarFormulario = true;
    this.novoHeroi = { ...heroi }; // copia os dados para o formulário
    this.editando = true;
  }

}
