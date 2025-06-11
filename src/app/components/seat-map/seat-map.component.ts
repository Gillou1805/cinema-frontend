import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';

type Cat = 'std' | 'special' | 'pmr';
type State = 'free' | 'reserved' | 'selected';

/**
 * Affiche une grille SVG de sièges.
 * Les propriétés stdCount / specialCount / pmrCount sont les nombres
 * totaux de sièges par catégorie.
 * reservedStd / reservedSpecial / reservedPmr sont les déjà réservés.
 * selectedStd / selectedSpecial / selectedPmr sont ceux choisis en cours.
 */
@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [ CommonModule ],
  template: `
    <svg
      [attr.width]="columns * seatSize"
      [attr.height]="rows * seatSize"
      class="seat-map"
    >
      <ng-container *ngFor="let s of seatList; let i = index">
        <circle
          [attr.cx]="(i % columns) * seatSize + seatSize/2"
          [attr.cy]="floor(i / columns) * seatSize + seatSize/2"
          [attr.r]="seatSize/2 - 2"
          [attr.fill]="fillColor(s.category, s.state)"
          stroke="#555" stroke-width="1"
        />
      </ng-container>
    </svg>
  `,
  styles: [`
    .seat-map { background: #fafafa; display: block; }
  `]
})
export class SeatMapComponent {
  /** Nombre total de sièges par catégorie */
  @Input() stdCount     = 0;
  @Input() specialCount = 0;
  @Input() pmrCount     = 0;

  /** Combien sont déjà réservés */
  @Input() reservedStd     = 0;
  @Input() reservedSpecial = 0;
  @Input() reservedPmr     = 0;

  /** Combien l’utilisateur vient de sélectionner */
  @Input() selectedStd     = 0;
  @Input() selectedSpecial = 0;
  @Input() selectedPmr     = 0;

  /** Nombre de colonnes dans la grille (ajustable) */
  @Input() columns = 10;

  /** Taille (px) de chaque case */
  @Input() seatSize = 30;

  get rows(): number {
    const total = this.stdCount + this.specialCount + this.pmrCount;
    return Math.ceil(total / this.columns);
  }

  /** Crée un tableau plat [{category, state}, …] pour tout rendre récursivement */
  get seatList(): { category:Cat, state:State }[] {
    const list: { category:Cat, state:State }[] = [];
    const pushCat = (
      cat: Cat,
      total: number,
      reserved: number,
      selected: number
    ) => {
      for (let i = 0; i < total; i++) {
        let state: State = 'free';
        if (i < reserved)              state = 'reserved';
        else if (i < reserved + selected) state = 'selected';
        list.push({ category: cat, state });
      }
    };
    pushCat('std',     this.stdCount,     this.reservedStd,     this.selectedStd);
    pushCat('special', this.specialCount, this.reservedSpecial, this.selectedSpecial);
    pushCat('pmr',     this.pmrCount,     this.reservedPmr,     this.selectedPmr);
    return list;
  }

  /** Couleurs : gris clair=réservé, vert=sélectionné, blanc/bleu/orange selon catégorie */
  fillColor(cat: Cat, state: State): string {
    if (state === 'reserved')   return '#ccc';
    if (state === 'selected')   return '#4caf50';
    if (cat === 'std')          return '#fff';
    if (cat === 'special')      return '#2196f3';
    if (cat === 'pmr')          return '#ff9800';
    return '#fff';
  }

  floor = Math.floor; // pour la template
}
