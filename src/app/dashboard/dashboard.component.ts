import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule, HttpClientModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  agencyId: string = '';
  isLoading = true;

  @ViewChild(BaseChartDirective) ageChart?: BaseChartDirective;
  @ViewChild(BaseChartDirective) carBrandChart?: BaseChartDirective;
  @ViewChild(BaseChartDirective) locationsChart?: BaseChartDirective;

  ageHistogramData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Âge des clients',
      backgroundColor: '#1abc9c',
      borderColor: '#16a085',
    }]
  };

  carBrandData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#f39c12', '#3498db', '#e74c3c', '#9b59b6', '#2ecc71'],
      borderColor: '#ecf0f1',
    }]
  };

  locationsPerMonthData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Locations par mois',
      backgroundColor: 'rgba(52, 152, 219, 0.3)',
      borderColor: '#2980b9',
      fill: true
    }]
  };

  ageChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        title: { display: true, text: 'Tranche d’âge', color: '#555' },
        ticks: { color: '#333' }
      },
      y: {
        title: { display: true, text: 'Nombre de clients', color: '#555' },
        ticks: { color: '#333' },
        beginAtZero: true
      }
    }
  };

  carBrandChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#333' }
      }
    }
  };

  locationsChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#333' }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Mois', color: '#555' },
        ticks: { color: '#333' }
      },
      y: {
        title: { display: true, text: 'Nombre de locations', color: '#555' },
        ticks: { color: '#333' },
        beginAtZero: true
      }
    }
  };

  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.agencyId = this.route.snapshot.paramMap.get('agencyId') || '';
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:9999/agency/${this.agencyId}/dashboard`).subscribe(data => {
      this.ageHistogramData.labels = Object.keys(data.ageHistogram || {});
      this.ageHistogramData.datasets[0].data = Object.values(data.ageHistogram || {});

      this.carBrandData.labels = Object.keys(data.carBrandDistribution || {});
      this.carBrandData.datasets[0].data = Object.values(data.carBrandDistribution || {});

      this.locationsPerMonthData.labels = Object.keys(data.locationsPerMonth || {});
      this.locationsPerMonthData.datasets[0].data = Object.values(data.locationsPerMonth || {});

      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }
}
