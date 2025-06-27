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
    this.heroiService.listarHerois().subscribe({
      next: (data: any) => {
        this.herois = (data._embedded?.heroiVoes || []).map((heroi: any) => {
          const url = heroi._links.self.href;
          const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
          return { ...heroi, id };
        });
      },
      error: (erro) => {
        console.error('Erro ao carregar heróis:', erro);
        alert('Erro ao buscar a lista de heróis. Tente novamente mais tarde.');
      }
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

  deletarHeroi(heroi: Heroi) {

    if (confirm(`Deseja realmente excluir o herói "${heroi.nomeDoHeroi}"?`)) {
      this.heroiService.deletarHeroi(heroi.id!).subscribe({
        next: () => {
          this.herois = this.herois.filter(h => h.id !== heroi.id);
        },
        error: (erro) => {
          console.error('Erro ao tentar deletar herói:', erro);
          alert('Erro ao deletar o herói. Verifique se ele existe ou tente novamente mais tarde.');
        }
      });
    }
  }

}
