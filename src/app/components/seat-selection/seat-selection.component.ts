// src/app/components/seat-selection/seat-selection.component.ts
import { Component, OnInit }         from '@angular/core';
import { ActivatedRoute }            from '@angular/router';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { MatButtonModule }           from '@angular/material/button';
import { MatIconModule }             from '@angular/material/icon';

import { ReservationService }        from '../../services/reservation.service';
import { CreneauService }            from '../../services/creneau.service';
import { AuthService }               from '../../services/auth.service';
import { ReservationDto }            from '../../models/reservation-dto';
import { Siege }                     from '../../models/siege';
import { Creneau }                   from '../../models/creneau';

type CategoryKey = 'std' | 'special' | 'pmr';

interface Seat {
  id: number;
  category: CategoryKey;
  isReserved: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <h2>🎥 Salle de cinéma</h2>
      <p class="subtitle">Créneau n°{{ creneauId }}</p>

      <!-- 1) Choix du nombre -->
      <div *ngIf="mode==='count'" class="counts-form">
        <label>
          Standard :
          <input type="number" [(ngModel)]="limits.std" min="0">
        </label>
        <label>
          Spécial :
          <input type="number" [(ngModel)]="limits.special" min="0">
        </label>
        <label>
          PMR :
          <input type="number" [(ngModel)]="limits.pmr" min="0">
        </label>
        <button mat-raised-button class="btn-confirm"
                (click)="goToMap()"
                [disabled]="totalLimit===0">
          Valider ({{ totalLimit }})
        </button>
      </div>

      <!-- 2) Plan de salle -->
      <div *ngIf="mode==='map'" class="seat-grid">
        <div *ngFor="let seat of seats"
             class="seat"
             [ngClass]="{
               reserved: seat.isReserved,
               selected: seat.isSelected,
               std:      seat.category==='std',
               special:  seat.category==='special',
               pmr:      seat.category==='pmr'
             }"
             (click)="toggleSeat(seat)"
             [title]="seat.category.toUpperCase() + ' – n°' + seat.id">
        </div>
      </div>

      <div *ngIf="mode==='map'" class="action-bar">
        <button mat-raised-button class="btn-pay"
                (click)="confirmAndPay()"
                [disabled]="selectedCount!==totalLimit">
          Confirmer ({{ selectedCount }}/{{ totalLimit }})
        </button>
        <div class="legend">
          <span><em class="box std"></em> Standard</span>
          <span><em class="box special"></em> Spécial</span>
          <span><em class="box pmr"></em> PMR</span>
          <span><em class="box reserved"></em> Occupé</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* === Container & Typography === */
    .container {
      background: #111;
      color: #ffeb3b;
      padding: 1rem;
      border-radius: 8px;
      max-width: 720px;
      margin: 2rem auto;
      box-shadow: 0 0 16px #000;
      font-family: 'Arial', sans-serif;
    }
    h2 {
      margin: 0;
      font-size: 1.8rem;
      letter-spacing: .05em;
    }
    .subtitle {
      margin-bottom: 1rem;
      font-size: 1.1rem;
      color: #ccc;
    }

    /* === Counts form === */
    .counts-form {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .counts-form label {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: .9rem;
    }
    .counts-form input {
      width: 3rem;
      text-align: center;
      border: 1px solid #444;
      border-radius: 4px;
      background: #222;
      color: #ffeb3b;
      margin-top: .3rem;
    }
    .btn-confirm {
      background: #ffeb3b;
      color: #111;
      margin-left: 1rem;
    }

    /* === Seat grid === */
    .seat-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 4px;
      margin: 0 auto 1rem;
      padding: .5rem;
      background: #fff;
      border-radius: 6px;
    }
    .seat {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
      transition: transform .1s, background .2s;
      border: 1px solid #444;
    }
    .seat:hover:not(.reserved):not(.selected) {
      transform: scale(1.2);
    }
    /* catégories */
    .seat.std       { background: #FFD600; }  /* jaune vif */
    .seat.special   { background: #FF3D00; }  /* orange vif */
    .seat.pmr       { background: #00C853; }  /* vert vif */

    .seat.reserved  { background: #BDBDBD !important; }  /* gris clair */
    .seat.selected  { background: #BDBDBD !important; }  /* ambre */

    /* === Action bar === */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      flex-wrap: wrap;
      gap: .5rem;
    }
    .btn-pay {
      background: #ffc107;
      color: #111;
    }
    .legend {
      display: flex;
      gap: 1rem;
      font-size: .85rem;
      color: #ccc;
    }
    .legend .box {
      display: inline-block;
      width: 14px;
      height: 14px;
      vertical-align: middle;
      margin-right: .3rem;
      border: 1px solid #444;
      border-radius: 2px;
    }
    .legend .std      { background: #FFD600; }
    .legend .special  { background: #FF3D00; }
    .legend .pmr      { background: #00C853; }
    .legend .reserved { background: #BDBDBD; }
  `]
})
export class SeatSelectionComponent implements OnInit {
  creneauId!: number;
  mode: 'count'|'map' = 'count';

  limits: Record<CategoryKey, number> = { std:0, special:0, pmr:0 };
  seats: Seat[] = [];

  prixSiegeStd     = 0;
  prixSiegeSpecial = 0;
  prixSiegePmr     = 0;

  private takenPositions = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private reservationSvc: ReservationService,
    private creneauSvc: CreneauService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.creneauId = +this.route.snapshot.paramMap.get('id')!;

    // 1) on récupère les tarifs
    this.creneauSvc.getCreneau(this.creneauId)
      .subscribe(cr => {
        if (cr.film) {
          this.prixSiegeStd     = cr.film.prixSiegeStd;
          this.prixSiegeSpecial = cr.film.prixSiegeSpecial;
          this.prixSiegePmr     = cr.film.prixSiegePmr;
        }
      });

    // 2) on récupère les positions déjà réservées
    this.reservationSvc.getTakenSeats(this.creneauId)
      .subscribe(sieges => {
        this.takenPositions = new Set(sieges.map(s => s.position));
      });
  }

  get totalLimit()    { return this.limits.std + this.limits.special + this.limits.pmr; }
  get selectedCount() { return this.seats.filter(s=>s.isSelected).length; }

  /** calcule le montant total selon les catégories */
  get totalPrice(): number {
    const sel = this.seats.filter(s=>s.isSelected);
    const stdCount     = sel.filter(s=>s.category==='std').length; // 1) prends uniquement les sièges dont category vaut "std"
    const specialCount = sel.filter(s=>s.category==='special').length; // 2) renvoie le nombre d’éléments dans cette liste filtrée
    const pmrCount     = sel.filter(s=>s.category==='pmr').length;
    return stdCount*this.prixSiegeStd
         + specialCount*this.prixSiegeSpecial
         + pmrCount*this.prixSiegePmr;
  }

  goToMap() {
    this.mode = 'map';
    this.buildSeatGrid();
  }

  private buildSeatGrid() { // permet de constuire le plan de la salle
    const rows=6, cols=12;
    this.seats = [];
    let id = 0;
    for (let r=0; r<rows; r++) {
      const cat:CategoryKey = r>=4 ? 'pmr' : r>=2 ? 'special' : 'std';
      for (let c=0; c<cols; c++) {
        const pos = ++id;
        this.seats.push({
          id: pos,
          category: cat,
          isReserved: this.takenPositions.has(pos),
          isSelected: false
        });
      }
    }
  }

  toggleSeat(s: Seat) {
    if (s.isReserved) return;
    s.isSelected = !s.isSelected;
  }

  /** boîte de dialogue de paiement */
  confirmAndPay() {
    const montant = this.totalPrice.toFixed(2);
    const ok = confirm(
      `Montant à payer : ${montant} €\n\n` +
      `Cliquez sur OK pour payer.`
    );
    if (ok) {
      this.pay();
    }
  }

  /** simulacre de paiement + enregistrement */
  private pay() {
    const montant = this.totalPrice.toFixed(2);
    const userId = this.auth.getUserId();
    if (!userId) {
      alert('Vous devez être connecté(e) pour réserver.');
      return;
    }
    const seatIds = this.seats
      .filter(s => s.isSelected)
      .map(s => s.id);

    const dto: ReservationDto = {
      userId,
      nbSiegeStd:     this.limits.std,
      nbSiegeSpecial: this.limits.special,
      nbSiegePmr:     this.limits.pmr,
      seatIds
    };

    this.reservationSvc.create(this.creneauId, dto)
      .subscribe({
        next: () => {
          alert(`Paiement de ${montant} € confirmé, merci !`);
          // on recharge le plan
          this.reservationSvc.getTakenSeats(this.creneauId)
            .subscribe(sieges => {
              this.takenPositions = new Set(sieges.map(s => s.position));
              this.buildSeatGrid();
              this.mode = 'count';
              this.limits = { std:0, special:0, pmr:0 };
            });
        },
        error: () => alert('Une erreur est survenue pendant la réservation.')
      });
  }
}
