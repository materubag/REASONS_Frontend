import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestigadoresStoreService } from '../../../../core/services';
import { Investigador } from '../../../../core/models';
import { resolveBackendUrl } from '../../../../core/utils/url';

@Component({
  selector: 'app-investigadores-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investigadores-page.html',
  styleUrl: './investigadores-page.scss',
})
export class InvestigadoresPage implements OnInit {
  investigadores: Investigador[] = [];
  allInvestigadores: Investigador[] = [];
  director?: Investigador;
  subdirector?: Investigador;
  otrosInvestigadores: Investigador[] = [];
  loading = true;
  loadingMore = false;
  copiedEmailId: number | null = null;
  page = 1;
  readonly limit = 20;
  hasNextPage = false;
  activeInvestigador: Investigador | null = null;

  constructor(private investigadoresStore: InvestigadoresStoreService) {}

  ngOnInit(): void {
    this.loadInvestigadores();
  }

  private loadInvestigadores(): void {
    this.page = 1;
    this.allInvestigadores = [];
    this.fetchInvestigadores(this.page, true);
  }

  loadMore(): void {
    if (!this.hasNextPage || this.loadingMore) {
      return;
    }
    this.fetchInvestigadores(this.page + 1, false);
  }

  private fetchInvestigadores(page: number, replace: boolean): void {
    if (replace) {
      this.loading = true;
    } else {
      this.loadingMore = true;
    }

    this.investigadoresStore.getInvestigadoresPage(page, this.limit).subscribe({
      next: (response) => {
        if (response.success) {
          const incoming = Array.isArray(response.data) ? response.data : [];
          this.allInvestigadores = replace
            ? [...incoming]
            : [...this.allInvestigadores, ...incoming];
          this.hasNextPage = Boolean(response.meta?.hasNextPage);
          this.page = page;
          this.applyInvestigadores(this.allInvestigadores);
        }
        this.loading = false;
        this.loadingMore = false;
      },
      error: (error) => {
        console.error('Error loading investigadores:', error);
        this.loading = false;
        this.loadingMore = false;
      },
    });
  }

  private applyInvestigadores(list: Investigador[]): void {
    const sorted = [...list].sort((a, b) => a.id - b.id);
    const normalize = (value?: string) => (value || '').toLowerCase();
    this.director =
      sorted.find((item) => {
        const cargo = normalize(item.cargo);
        return cargo.includes('director') && !cargo.includes('subdirector');
      }) || sorted.find((item) => item.id === 1);
    const restantes = sorted.filter((item) => item.id !== this.director?.id);
    this.otrosInvestigadores = restantes.sort((a, b) => {
      const cargoA = normalize(a.cargo);
      const cargoB = normalize(b.cargo);
      const isSubA = cargoA.includes('subdirector');
      const isSubB = cargoB.includes('subdirector');
      if (isSubA && !isSubB) return -1;
      if (!isSubA && isSubB) return 1;
      return a.id - b.id;
    });
    if (!this.subdirector) {
      this.subdirector =
        sorted.find((item) => normalize(item.cargo).includes('subdirector')) ||
        sorted.find((item) => item.id === 2);
    }
    this.investigadores = sorted;
  }

  copyEmail(email: string | undefined, investigadorId: number): void {
    if (!email) {
      return;
    }
    navigator.clipboard
      .writeText(email)
      .then(() => {
        this.copiedEmailId = investigadorId;
        setTimeout(() => {
          if (this.copiedEmailId === investigadorId) {
            this.copiedEmailId = null;
          }
        }, 1500);
      })
      .catch(() => {
        this.copiedEmailId = null;
      });
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }

  openModal(investigador: Investigador): void {
    this.activeInvestigador = investigador;
  }

  closeModal(): void {
    this.activeInvestigador = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeInvestigador) {
      this.closeModal();
    }
  }

  getShortBio(value?: string): string {
    const text = (value || '').trim();
    if (!text) {
      return '';
    }

    const periodIndex = text.indexOf('.');
    if (periodIndex === -1) {
      return `${text}...`;
    }

    const firstSentence = text.slice(0, periodIndex).trim();
    return firstSentence ? `${firstSentence}...` : `${text}...`;
  }
}
