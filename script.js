let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;

const ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [], // Categories will be set here
        datasets: [{
            label: 'Transactions',
            data: [], // Values will be set here
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Function to add a transaction
function addTransaction() {
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;

    if (!date || !description || !category || isNaN(amount) || !currency) {
        alert('Please fill in all fields.');
        return;
    }

    const transaction = { date, description, category, amount, currency };
    transactions.push(transaction);
    
    updateSummary(transaction);
    renderTransaction(transaction);
    updateChart();
    
    // Clear input fields after adding transaction
    document.getElementById('transactionForm').reset();
}

// Function to update total income and expenses
function updateSummary(transaction) {
    if (transaction.amount >= 0) {
        totalIncome += transaction.amount;
    } else {
        totalExpenses += Math.abs(transaction.amount);
    }

    document.getElementById('totalIncome').innerText = 'Total Income: ' + totalIncome.toFixed(2);
    document.getElementById('totalExpenses').innerText = 'Total Expenses: ' + totalExpenses.toFixed(2);
    document.getElementById('netIncome').innerText = 'Net Income: ' + (totalIncome - totalExpenses).toFixed(2);
}

// Function to render transaction in the table
function renderTransaction(transaction) {
    const transactionBody = document.getElementById('transactionBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${transaction.amount.toFixed(2)}</td>
        <td>${transaction.currency}</td>
        <td><button class="btn btn-danger" onclick="deleteTransaction(this)">Delete</button></td>
    `;
    
    transactionBody.appendChild(row);
}

// Function to delete a transaction
function deleteTransaction(button) {
    const row = button.parentElement.parentElement;
    const amount = parseFloat(row.children[3].innerText);
    
    // Update total income or expenses
    if (amount >= 0) {
        totalIncome -= amount;
    } else {
        totalExpenses -= Math.abs(amount);
    }
    
    // Remove the transaction from the table and update the summary
    row.remove();
    updateSummary({ amount });
    updateChart();
}

// Function to update the chart with transaction data
function updateChart() {
    const categories = {};
    transactions.forEach(transaction => {
        if (!categories[transaction.category]) {
            categories[transaction.category] = 0;
        }
        categories[transaction.category] += transaction.amount;
    });

    expenseChart.data.labels = Object.keys(categories);
    expenseChart.data.datasets[0].data = Object.values(categories);
    expenseChart.update();
}

// Function to filter transactions based on selected category and currency
function filterTransactions() {
    const filterCategory = document.getElementById('filterCategory').value;
    const filterCurrency = document.getElementById('filterCurrency').value;

    const transactionBody = document.getElementById('transactionBody');
    transactionBody.innerHTML = '';

    transactions.forEach(transaction => {
        const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;
        const currencyMatch = filterCurrency === 'all' || transaction.currency === filterCurrency;

        if (categoryMatch && currencyMatch) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>${transaction.currency}</td>
                <td><button class="btn btn-danger" onclick="deleteTransaction(this)">Delete</button></td>
            `;
            transactionBody.appendChild(row);
        }
    });
}
