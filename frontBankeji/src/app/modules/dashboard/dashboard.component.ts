import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Compte } from 'src/Models/Compte';
import { CompteService } from 'src/Services/compte.service';
import { ClientService } from 'src/Services/client.service';
import { Client } from 'src/Models/Client';
import { Transaction } from 'src/Models/Transaction';
import { TransactionService } from 'src/Services/transaction.service';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    DatePipe // Ajoutez DatePipe aux fournisseurs du module
  ]
})
export class DashboardComponent{
  comptes: Compte[] = [];
  clients: Client[] = [];
  transactions: Transaction[] = [];
  totalComptes: number = 0;
  totalClient: number = 0;
  totalTransactions: number = 0;
  // Données pour le graphique en camembert (comptes par type)
// Déclaration des options pour les graphiques
chartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      enabled: true
    }
  }
};

// Données pour les graphiques
chartDatapie: ChartData<'pie'> = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB']
    }
  ]
};

chartDatabar: ChartData<'line'> = {
  labels: [],
  datasets: [
    {
      label: 'Transactions',
      data: [],
      borderColor: '#42A5F5',
      backgroundColor: 'rgba(66, 165, 245, 0.2)',
      fill: true
    }
  ]
};
chartOptions1: ChartOptions<'line'> = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        stepSize: 1, // Affiche des nombres entiers
      }
    }
  }
};


  constructor(private compteService: CompteService , private clientService : ClientService , private transactionService : TransactionService) {}

  ngOnInit(): void {
    this.compteService.findAllCompte().subscribe(
      data => {
        this.comptes = data;
        this.totalComptes = data.length;
        console.log('Total comptes:', this.totalComptes);
      },
      (error) => {
        console.error('Erreur lors de la récupération des comptes:', error);
      }
    );
    this.clientService.findAllClient().subscribe(data => {
        this.clients = data;
        this.totalClient = data.length;
        console.log('Total clients:', this.totalClient);
      },
      (error) => {
        console.error('Erreur lors de la récupération des clients:', error);
      }
    );
    this.transactionService.findAllTransaction().subscribe(data => {
      this.transactions = data;
      this.totalTransactions = data.length;
      console.log('Total transactions:', this.totalTransactions);
    },
    (error) => {
      console.error('Erreur lors de la récupération des transactions:', error);
    }
  );
  this.loadComptesData();
    this.loadTransactionsData();
  }
    // Charger les données des comptes par type
  // Charger les données des comptes
  loadComptesData(): void {
    this.compteService.findAllCompte().subscribe((data: any[]) => {
      // Vérifier les données reçues dans la console
      console.log('Données des comptes:', data);

      // Vérifier si les données sont valides
      if (!Array.isArray(data)) {
        console.error('Les données reçues ne sont pas un tableau');
        return;
      }

      // Créer un objet pour stocker le nombre de comptes par type
      const compteCounts: { [key: string]: number } = {};

      // Compter les comptes par type
      data.forEach(compte => {
        if (compte.typeCompte) {
          if (compteCounts[compte.typeCompte]) {
            compteCounts[compte.typeCompte] += 1; // Incrémenter le nombre de comptes pour ce type
          } else {
            compteCounts[compte.typeCompte] = 1; // Initialiser le compteur pour un nouveau type
          }
        } else {
          console.warn('Données de compte invalides:', compte);
        }
      });

      // Extraire les labels et les données pour les graphiques
      this.chartDatapie.labels = Object.keys(compteCounts); // Labels = types de comptes (ex: 'Courant', 'Epargne')
      this.chartDatapie.datasets[0].data = Object.values(compteCounts); // Données = nombre de comptes pour chaque type

      // Vérifier les résultats avant d'afficher le graphique
      console.log('Labels des graphiques:', this.chartDatapie.labels);
      console.log('Données du graphique:', this.chartDatapie.datasets[0].data);
    }, (error) => {
      console.error('Erreur lors du chargement des données des comptes', error);
    });
  }

  // Charger les données des transactions
  loadTransactionsData(): void {
    this.transactionService.findAllTransaction().subscribe((data: any[]) => {
      console.log('Données des transactions:', data);

      if (!Array.isArray(data)) {
        console.error('Les données de transaction ne sont pas un tableau');
        return;
      }

      const today = new Date();
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(today.getDate() - 5);

      const allDates = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        allDates.push(date.toLocaleDateString());
      }

      const filteredTransactions = data.filter(transaction => {
        if (!transaction.dateTransaction) {
          console.warn('Transaction sans date détectée:', transaction);
          return false;
        }

        const transactionDate = new Date(transaction.dateTransaction);
        if (isNaN(transactionDate.getTime())) {
          console.error('Date invalide détectée:', transaction.dateTransaction);
          return false;
        }

        const transactionDateOnly = transactionDate.setHours(0, 0, 0, 0);
        const fiveDaysAgoOnly = fiveDaysAgo.setHours(0, 0, 0, 0);
        const todayOnly = today.setHours(23, 59, 59, 999);

        return transactionDateOnly >= fiveDaysAgoOnly && transactionDateOnly <= todayOnly;
      });

      const transactionCountByDate = filteredTransactions.reduce((acc, transaction) => {
        const transactionDate = new Date(transaction.dateTransaction);
        const dateString = transactionDate.toLocaleDateString();

        acc[dateString] = (acc[dateString] || 0) + 1;
        return acc;
      }, {});

      const transactionCounts: number[] = allDates.map(date => {
        return transactionCountByDate[date] || 0;
      });

      if (allDates.length === 0 || transactionCounts.length === 0) {
        console.warn('Aucune donnée valide trouvée');
        return;
      }

      this.chartDatabar.labels = allDates;
      this.chartDatabar.datasets[0].data = transactionCounts;

      console.log('Labels des graphiques:', this.chartDatabar.labels);
      console.log('Données du graphique:', this.chartDatabar.datasets[0].data);
    }, error => {
      console.error('Erreur lors du chargement des transactions', error);
    });
  } 
}


