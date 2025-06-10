const cryptoList = document.getElementById('crypto-tbody');
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const vsCurrency = 'usd';
const url = `${API_URL}?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=true`;

async function getTopCryptos() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    cryptoList.innerHTML = ''; 
    data.forEach((coin, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <img src="${coin.image}" alt="${coin.name}" width="20" style="vertical-align:middle; margin-right:8px;">
          ${coin.name} <span style="color:gray;">${coin.symbol.toUpperCase()}</span>
        </td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td style="color:${coin.price_change_percentage_24h > 0 ? 'green' : 'red'};">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </td>
        <td><canvas id="spark-${coin.id}" width="100" height="30"></canvas></td>
      `;
      cryptoList.appendChild(row);

     
      const sparkCtx = document.getElementById(`spark-${coin.id}`).getContext('2d');
      new Chart(sparkCtx, {
        type: 'line',
        data: {
          labels: coin.sparkline_in_7d.price.map((_, i) => i),
          datasets: [{
            data: coin.sparkline_in_7d.price,
            borderColor: '#4caf50',
            borderWidth: 1,
            fill: false,
            tension: 0.3,
            pointRadius: 0
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } },
          responsive: false,
          maintainAspectRatio: false
        }
      });
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des données crypto:', error);
  }
}

getTopCryptos();
