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
  mostrarBuscaPorId: boolean = false;
  idBusca: number | null = null;

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
    this.editando = false;
    this.novoHeroi = {
      nome: '',
      nomeDoHeroi: '',
      dataDeNascimento: '',
      altura: 0,
      peso: 0
    };
  }

  abrirBuscaPorId() {
    this.mostrarBuscaPorId = true;
    this.idBusca = null;
  }

  buscarHeroiPorId() {
    if (this.idBusca != null) {
      this.heroiService.buscarHeroiPorId(this.idBusca).subscribe(
        (heroi) => {
          this.herois = [heroi];
          this.mostrarBuscaPorId = false;
        },
        (erro) => {
          console.error('Herói não encontrado:', erro);
          alert('Herói não encontrado com esse ID.');
        }
      );
    }
  }

  criarHeroi() {
    this.heroiService.cadastrarHeroi(this.novoHeroi).subscribe((heroiSalvo) => {
      this.herois.push(heroiSalvo);
      this.fecharFormulario();
    }, (erro) => {
      console.error('Erro ao cadastrar herói:', erro);
      alert('Erro ao cadastrar herói.');
    });
  }

  editarHeroiConfirmado() {
    const payload = {
      indentificador: this.novoHeroi.id,
      nome: this.novoHeroi.nome,
      nomeDoHeroi: this.novoHeroi.nomeDoHeroi,
      dataDeNascimento: this.novoHeroi.dataDeNascimento,
      altura: this.novoHeroi.altura,
      peso: this.novoHeroi.peso
    };

    this.heroiService.atualizarHeroi(payload).subscribe(() => {
      const index = this.herois.findIndex(h => h.id === this.novoHeroi.id);
      if (index !== -1) {
        this.herois[index] = { ...this.novoHeroi };
        this.herois = [...this.herois];
      }
      this.fecharFormulario();
    }, (erro) => {
      console.error('Erro ao atualizar herói:', erro);
      alert('Erro ao atualizar herói.');
    });
  }

  editarHeroi(heroi: Heroi) {
    this.novoHeroi = { ...heroi };
    this.editando = true;
    this.mostrarFormulario = true;
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
