// --- Data & Rates ---
let assets = [];
const rates = { USD: 1, EUR: 0.91, INR: 83.5 };

// --- References ---
const currencySelect = document.getElementById("currency-select");
const totalBalanceEl = document.getElementById("total-balance");
const addAssetBtn = document.getElementById("add-asset");
const assetNameEl = document.getElementById("asset-name");
const assetValueEl = document.getElementById("asset-value");
const assetListEl = document.getElementById("asset-list");
const chartCtx = document.getElementById("portfolio-chart").getContext("2d");

// --- Chart ---
const chart = new Chart(chartCtx, {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'Portfolio value', data: [], borderColor: '#00c798', tension: 0.3 }] },
  options: { scales: { x: { display: false }, y: { beginAtZero: true } } }
});

// --- Functions ---
function updateChart() {
  const totalUSD = assets.reduce((sum, a) => sum + a.amountUSD, 0);
  const now = new Date().toLocaleTimeString();
  chart.data.labels.push(now);
  chart.data.datasets[0].data.push(totalUSD * rates[currencySelect.value]);
  if(chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

function render() {
  const rate = rates[currencySelect.value];
  assetListEl.innerHTML = '';
  assets.forEach(a => {
    const converted = (a.amountUSD * rate).toFixed(2);
    const div = document.createElement('div');
    div.className = 'asset';
    div.innerHTML = `<span class="asset-name">${a.name}</span><span class="asset-value">${converted} ${currencySelect.value}</span>`;
    assetListEl.appendChild(div);
  });

  const total = assets.reduce((sum, a) => sum + a.amountUSD, 0) * rate;
  totalBalanceEl.textContent = `${currencySelect.value} ${total.toFixed(2)}`;
}

// --- Event Listeners ---
addAssetBtn.addEventListener('click', () => {
  const name = assetNameEl.value.trim();
  const val = parseFloat(assetValueEl.value);
  if(!name || isNaN(val)) return alert('Enter name & USD value');
  assets.push({ name, amountUSD: val });
  assetNameEl.value = '';
  assetValueEl.value = '';
  render();
  updateChart();
});

currencySelect.addEventListener('change', render);

// --- Initial Render ---
render();
