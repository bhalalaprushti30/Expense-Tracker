const balanceEl = document.getElementById('balance');
const form = document.getElementById('transaction-form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const clearBtn = document.getElementById('clear-transactions');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chartInstance;

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);
    const type = typeEl.value;

    if (description && !isNaN(amount) && amount > 0) {
        transactions.push({ description, amount, type });
        updateUI();
        saveTransactions();
        form.reset();
    }
});

clearBtn.addEventListener('click', function() {
    transactions = [];
    updateUI();
    saveTransactions();
});

function updateUI() {
    let totalBalance = 0;
    let income = 0;
    let expenses = 0;
    
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `${transaction.description}: $${transaction.amount.toFixed(2)}`;
        li.classList.add(transaction.type === 'income' ? 'income' : 'expense');

        if (transaction.type === 'income') {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
        
        totalBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
        transactionList.appendChild(li);
    });

    balanceEl.textContent = `$${totalBalance.toFixed(2)}`;
    totalIncomeEl.textContent = `$${income.toFixed(2)}`;
    totalExpensesEl.textContent = `$${expenses.toFixed(2)}`;

    updateChart(income, expenses);
}

function updateChart(income, expenses) {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expenses],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initial UI update
updateUI();
