import {getLastTransaction, postNewTransaction, deployment_id} from './apiHandler.js';
import {currentBalance, getLedger} from './TransactionParser.js';

let particulars = [
    // debit
    "Spare Cash",
    "Wallet",
    "Online Money",
    "Bank",
    "Expense",
    "Receivable",
    // credit
    "Capital",
    "Payable"
]

let transactionData = null

if (deployment_id === null) {
    window.location.href = 'onboarding.html'
}
const user_name = localStorage.getItem('user_name_key')

if (user_name !== null) {
    $('#greeting-box').text(`Hello, ${user_name}!`)
}

$('#ledger-account').html(particulars.map(p => `<option${p === "Wallet" ? " selected" : ""}>${p}</option>`).join(''))
$('#ledger-account').on('change', function () {
    displayLedger(this.value)
})

$("#debit-select, #credit_select").append(particulars.map(p => `<option>${p}</option>`).join(""))

// Using async/await
async function displayTransaction() {
    try {
        const data = await getLastTransaction();
        console.log(currentBalance(data.data));
        console.log(getLedger(data.data, "Wallet"));
    } catch (error) {
        console.error('Error getting transaction:', error);
    }
}

async function displayLedger(key) {
    if (transactionData === null) {
        try {
            transactionData = await getLastTransaction();
            // console.log(transactionData)
        } catch (error) {
            alert('There was an error fetching data. Please try again later or try resetting the DEPLOYMENT ID.');
            return
        }
    }
    console.log('hi, transactionData is already fetched')
    let ledgerData = getLedger(transactionData.data, key).reverse();
    // console.log(transactionData.data)
    let trHTML = []

    let dataCount = 0

    ledgerData.forEach(td => {
        const rowSpan = td.debit.length + td.credit.length;
        const dateCell = `<td rowspan="${rowSpan}">${td.date}</td>`;
        const balanceCell = `<td rowspan="${rowSpan}">${td.balance} TK</td>`;
        let isFirstRow = true;

        const renderTransaction = (transaction, isDebit) => {
            const html = `
                    <tr>
                    ${isFirstRow ? dateCell : ""}
                        <td>${transaction.remark}</td>
                        <td>${isDebit ? transaction.amount + ' TK' : ''}</td>
                        <td>${!isDebit ? transaction.amount + ' TK' : ''}</td>
                    ${isFirstRow ? balanceCell : ""}
                    </tr>
                `;
            isFirstRow = false;
            return html;
        };

        // console.log(td)
        td.debit.forEach(d => {
            trHTML.push(renderTransaction(d, true))
            // console.log(d)
        });
        td.credit.forEach(c => trHTML.push(renderTransaction(c, false)));
        dataCount += td.debit.length + td.credit.length;
    });

    // console.log(trHTML)
    if (dataCount === 0) {
        $('#transaction-ledger-body').html(`<td colSpan="5" style="text-align: center">Loading...</td>`);
        return
    }
    $('#transaction-ledger-body').html(trHTML.join(''));
}

// displayTransaction();
displayLedger($('#ledger-account').val());

$('#submit-btn').click(function () {
    const debitEntries = [];
    $('#debit_card div[role="group"]').each(function () {
        const particular = $(this).find('select').val();
        const amount = parseFloat($(this).find('.amount-input').val());
        const remark = $(this).find('.remark-input').val()
        if (particular) {
            debitEntries.push({
                particular: particular,
                amount: amount,
                remark: remark
            });
        }
    });

    const creditEntries = [];
    $('#credit_card div[role="group"]').each(function () {
        const particular = $(this).find('select').val();
        const amount = parseFloat($(this).find('.amount-input').val());
        const remark = $(this).find('.remark-input').val()
        if (particular) {
            creditEntries.push({
                particular: particular,
                amount: amount,
                remark: remark
            });
        }
    });

    const data = {
        date: new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }),
        transaction: {
            description: $('#description-input').val(),
            debit: debitEntries,
            credit: creditEntries,
        }
    }
    console.log(data)
    postNewTransaction(data)
});

const newDebitCreditOptionHTML = `
        <div role="group">
            <select name="select" class="debit-select" aria-label="Select" required>
                <option selected disabled value="">Particular</option>
                ${particulars.map(p => `<option>${p}</option>`).join('')}
            </select>
            <input placeholder="Amount" class="amount-input" name="amount" min="0" step="1" value="0"/>
            <input placeholder="Remark" class="remark-input" type="text"/>
        </div>
`
$('#add-debit').click(function () {
    $(newDebitCreditOptionHTML).insertBefore('#add-debit');
});

$('#add-credit').click(function () {
    $(newDebitCreditOptionHTML).insertBefore('#add-credit');
});

$('#rst-dep-key').click(function () {
    localStorage.removeItem('development_key')
    window.location.href = 'onboarding.html'
})


