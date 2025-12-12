const balance = document.getElementById('total-balance');
const money_plus = document.getElementById('total-income');
const money_minus = document.getElementById('total-expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const date = document.getElementById('date');

const ctx = document.getElementById('expense-chart').getContext('2d');
let myChart;

// 로컬 스토리지에서 데이터 가져오기
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// DOM에 거래 내역 추가
function addTransactionDOM(transaction) {
  // 수입인지 지출인지 확인
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // 클래스 추가 (수입/지출 색상 표시)
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount).toLocaleString()}원</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// 밸런스, 수입, 지출 업데이트 및 차트 업데이트
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0);
  
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  );

  balance.innerText = `${total.toLocaleString()}원`;
  money_plus.innerText = `+${income.toLocaleString()}원`;
  money_minus.innerText = `-${expense.toLocaleString()}원`;

  updateChart(income, expense);
}

// 차트 업데이트 함수
function updateChart(income, expense) {
    if (myChart) {
        myChart.destroy();
    }

    // 데이터가 없으면 차트를 그리지 않음 (혹은 0으로 표시)
    if (income === 0 && expense === 0) {
        // 빈 차트 혹은 숨김 처리 가능, 여기선 0으로 표시
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['수입', '지출'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#2ecc71', '#c0392b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// 거래 추가 함수
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || date.value.trim() === '') {
    alert('내용과 금액, 날짜를 모두 입력해주세요.');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    date: date.value
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  
  // 입력 필드 초기화
  text.value = '';
  amount.value = '';
}

// 랜덤 ID 생성
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// 거래 삭제
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();
  init();
}

// 로컬 스토리지 업데이트
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 초기화
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);

// 오늘 날짜로 기본 설정
date.valueAsDate = new Date();

