import { Component, Input, OnInit } from '@angular/core';
import { FormattedSavedTracks } from '../models/user-saved-tracks';
import { TopArtistsService } from '../services/top-artists.service';
import { TopTracksService } from '../services/top-tracks.service';
import { WebStorageService } from '../services/web-storage.service';

@Component({
  selector: 'app-six-months-stats',
  templateUrl: './six-months-stats.component.html',
  styleUrls: ['./six-months-stats.component.css'],
})
export class SixMonthsStatsComponent implements OnInit {
  topArtist = '';
  topArtistImage: any;
  tracks?: FormattedSavedTracks;
  avgPopularity = 0;
  tracksIds: string = '';
  features: any;
  avgDanceability = 0;
  avgEnergy = 0;
  avgLoudness = 0;
  avgTempo = 0;
  avgValence = 0;

  constructor(
    private webStorageService: WebStorageService,
    private topTracksService: TopTracksService,
    private topArtistsService: TopArtistsService
  ) {}

  ngOnInit(): void {
    this.getTopTracks();
    this.getTopArtist();
  }

  getTopArtist(): void {
    this.topArtistsService
      .getTopArtists6Months(this.webStorageService.get('ACCESS_TOKEN'))
      .subscribe((data: any) => {
        this.topArtist = data.items[0].name;
        this.topArtistImage = data.items[0].images[0].url;
      });
  }

  getTopTracks(): void {
    this.topTracksService
      .getTopTracks6Months(this.webStorageService.get('ACCESS_TOKEN'))
      .subscribe((data: any) => {
        this.tracks = data;
        this.avgPopularity = this.getAveragePopularity();
        this.getTracksIds();
        this.getAudioFeatures();
      });
  }

  getAudioFeatures(): void {
    this.topTracksService
      .getAudioFeatures(
        this.webStorageService.get('ACCESS_TOKEN'),
        this.tracksIds
      )
      .subscribe((data: any) => {
        this.features = data.audio_features;
        this.avgDanceability = this.getAverageDanceability();
        this.avgEnergy = this.getAverageEnergy();
        this.avgLoudness = this.getAverageLoudness();
        this.avgTempo = this.getAverageTempo();
        this.avgValence = this.getAverageValence();
      });
  }

  getAveragePopularity(): number {
    let sum = 0;
    if (this.tracks) {
      for (let item of this.tracks.items) {
        sum += item.popularity;
      }
    }
    return sum / 50;
  }

  popularityFormatting = (data: any) => {
    return `${data.toString()}%`;
  };

  // returns a comma-separated list of the Spotify IDs for the tracks.
  getTracksIds(): void {
    if (this.tracks) {
      for (let item of this.tracks.items) {
        this.tracksIds += item.id + ',';
      }
      this.tracksIds = this.tracksIds.slice(0, -1);
    }
  }

  getAverageDanceability(): number {
    let sum = 0;
    if (this.features) {
      for (let item of this.features) {
        sum += item.danceability;
      }
    }
    return sum / 50;
  }

  danceabilityFormatting = (data: any) => {
    return `${parseFloat(data).toFixed(2).toString()}%`;
  };
  getAverageEnergy(): number {
    let sum = 0;
    if (this.features) {
      for (let item of this.features) {
        sum += item.energy;
      }
    }
    return sum / 50;
  }

  energyFormatting = (data: any) => {
    return `${parseFloat(data).toFixed(2).toString()}%`;
  };

  getAverageLoudness(): number {
    let sum = 0;
    if (this.features) {
      for (let item of this.features) {
        sum += item.loudness;
      }
    }
    return sum / 50;
  }

  getAverageTempo(): number {
    let sum = 0;
    if (this.features) {
      for (let item of this.features) {
        sum += item.tempo;
      }
    }
    return sum / 50;
  }

  getAverageValence(): number {
    let sum = 0;
    if (this.features) {
      for (let item of this.features) {
        sum += item.valence;
      }
    }
    return sum / 50;
  }

  valenceFormatting = (data: any) => {
    return `${parseFloat(data).toFixed(2).toString()}%`;
  };
}
