// src/app/components/film-detail/film-detail.component.ts
import { Component, OnInit }                from '@angular/core';
import { ActivatedRoute, Router }           from '@angular/router';
import { DomSanitizer, SafeResourceUrl }    from '@angular/platform-browser';
import { DatePipe }                         from '@angular/common';
import { CommonModule }                     from '@angular/common';
import { RouterModule }                     from '@angular/router';
import { MatToolbarModule }                 from '@angular/material/toolbar';
import { MatFormFieldModule }               from '@angular/material/form-field';
import { MatDatepickerModule }              from '@angular/material/datepicker';
import { MatInputModule }                   from '@angular/material/input';
import { MatNativeDateModule }              from '@angular/material/core';
import { MatButtonModule }                  from '@angular/material/button';
import { MatIconModule }                    from '@angular/material/icon';
import { FormsModule }                      from '@angular/forms';

import { FilmService }                      from '../../../services/film.service';
import { CreneauService }                   from '../../../services/creneau.service';
import { Film }                             from '../../../models/film';
import { Creneau }                          from '../../../models/creneau';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [DatePipe],
  template: `
    <div class="detail-container">
      <!-- Toolbar stylisée -->
      <mat-toolbar class="detail-toolbar">
        <button mat-icon-button routerLink="/home">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="title">{{ film?.titre }}</span>
      </mat-toolbar>

      <!-- Si on a un trailer, on l'affiche, sinon message -->
      <ng-container *ngIf="film?.trailerUrl; else noTrailer">
        <div class="video-container">
            <iframe
                [src]="trailerUrl"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
            </div>
      </ng-container>
      <ng-template #noTrailer>
        <div class="no-trailer">
          <mat-icon>videocam_off</mat-icon>
          <p>Aucun trailer disponible.</p>
        </div>
      </ng-template>

      <!-- Description et sélection de date/créneau -->
      <div class="info-section">
        <h3 class="infos-header">INFOS</h3>
        <p class="description">{{ film?.description }}</p>
        <div class="picker-actions">
          <mat-form-field appearance="fill" class="date-picker">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          <button mat-raised-button class="btn-watch"
                  (click)="loadSlots()"
                  [disabled]="!selectedDate">
            Voir créneaux
          </button>
        </div>
        <div class="slots-container" *ngIf="slots.length">
          <button mat-flat-button color="accent" class="slot-btn"
                  *ngFor="let s of slots"
                  (click)="goToSeatSelection(s.idCreneau)">
            {{ s.heureDebut | date:'HH:mm' }}
          </button>
        </div>
        <p class="no-slots" *ngIf="slots && !slots.length">
          Aucun créneau disponible pour cette date.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      background-color: #121212;
      color: #ffffff;
      min-height: 100vh;
    }
    .detail-toolbar {
      background-color: #FFC107;
      color: #212121;
      position: sticky; top: 0; z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .title { font-size: 1.5rem; font-weight: 500; margin-left: 8px; }

    .video-wrapper {
      width: 80%; max-width: 800px; margin: 24px auto;
      position: relative; padding-top: 45%;
      border: 2px solid #FFC107; border-radius: 8px;
      overflow: hidden;
    }

        .infos-header {
    color: #FFC107;
    font-size: 1.25rem;
    margin: 16px 0 8px;
    border-bottom: 1px solid #444;
    padding-bottom: 4px;
    }

    .video-container {
  width: 100%;
  max-width: 1080px;    /* largeur maximale souhaitée */
  aspect-ratio: 16 / 9; /* ratio 16:9 pour une vidéo horizontale */
  margin: 0 auto;      /* centrage horizontal */
}
.video-container iframe {
  width: 100%;
  height: 100%;
}
    .no-trailer {
      text-align: center;
      margin: 32px auto;
      color: #bbbbbb;
    }
    .no-trailer mat-icon {
      font-size: 48px; display: block; margin-bottom: 8px;
    }

    .info-section { padding: 16px; }
    .description { font-size: 1rem; line-height: 1.5; margin-bottom: 16px; }
    .picker-actions {
      display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .date-picker {
      background: rgba(255,255,255,0.1);
      border-radius: 4px; width: 200px;
    }
    .date-picker .mat-input-element { color: #ffffff; }

    .btn-watch {
      background-color: #FFC107; color: #212121;
    }
    .btn-watch:hover { background-color: #ffb300; }

    .slots-container {
      display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;
    }
    .slot-btn {
      background-color: #FFC107; color: #212121;
      padding: 8px 16px; border-radius: 20px; font-weight: bold;
      min-width: 80px; text-align: center;
    }
    .slot-btn:hover { background-color: #ffb300; }

    .no-slots {
      color: #bbbbbb; font-style: italic; margin-top: 8px;
    }

    @media (max-width: 600px) {
      .video-wrapper { width: 95%; padding-top: 50%; }
      .date-picker { width: 100%; }
    }
  `]
})
export class FilmDetailComponent implements OnInit {
  film?: Film;
  trailerUrl: SafeResourceUrl = '';
  selectedDate?: Date;
  slots: Creneau[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filmSvc: FilmService,
    private creneauSvc: CreneauService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.filmSvc.getById(id).subscribe(f => {
    this.film = f;
    if (f.trailerUrl) {
      const embed = this.toEmbedUrl(f.trailerUrl);
      this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
    } // extrait l'id de l'url, recupere le film correspondant et l affiche et prépare l url sécuriséee du trailer
  });
}

  loadSlots() {
    if (!this.film || !this.selectedDate) return;
    const d = this.selectedDate;
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    this.creneauSvc.getByFilmAndDate(this.film.idFilm!, dateStr)
      .subscribe(creneaux => this.slots = creneaux); //loadSlots() vérifie qu’un film et une date sont sélectionnés, formate la date en YYYY-MM-DD, interroge le service pour récupérer les créneaux disponibles de ce film à cette date, puis stocke ces créneaux dans this.slots
  }

  goToSeatSelection(creneauId: number) {
    this.router.navigate(['/client/creneau', creneauId, 'reservation']);
  }

  private toEmbedUrl(url: string): string { //La méthode toEmbedUrl transforme une URL YouTube « classique » en URL destinée à être utilisée dans un <iframe> (format embed
  // 1) extrait l’ID de la vidéo
  let videoId = '';
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  } else {
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    videoId = shortMatch ? shortMatch[1] : '';
  }
  // 2) reconstruit l’URL embed
  return videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : url;  // si pas de match, on retombe sur l’original
}
}
