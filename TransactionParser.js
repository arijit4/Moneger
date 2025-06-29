let particulars = {
    "debit": [
        "Spare Cash",
        "Wallet",
        "Online Money",
        "Bank",
        "Expense",
        "Receivable"
    ],
    "credit": [
        "Capital",
        "Payable"
    ]
}

export function currentBalance(transactionData, key = null) {
    let balances = {}
    const allParticulars = [...particulars.debit, ...particulars.credit]

    allParticulars.forEach(particular => {
        const isDebitAccount = particulars.debit.includes(particular)
        let current = 0
        transactionData.forEach(td => {
            td.transaction.debit
                .filter(debit => debit.particular === particular)
                .forEach(debit => current += debit.amount * (isDebitAccount ? 1 : -1));
            td.transaction.credit
                .filter(credit => credit.particular === particular)
                .forEach(credit => current -= credit.amount * (isDebitAccount ? 1 : -1));

        })
        balances[particular] = current
    })
    return key ? balances[key] : balances

}

export function getLedger(transactionData, key) {
    let ledgerInfo = [];
    const isDebitAccount = particulars.debit.includes(key)
    let currentBalance = 0;

    transactionData.forEach(td => {
        const debits = td.transaction.debit.filter(data => data.particular === key)
        const credits = td.transaction.credit.filter(data => data.particular === key)

        debits.forEach(debit => currentBalance += debit.amount * (isDebitAccount ? 1 : -1));
        credits.forEach(credit => currentBalance -= credit.amount * (isDebitAccount ? 1 : -1));

        // console.log(currentBalance)

        ledgerInfo.push(
            {
                "date": td.date,
                "debit": debits,
                "credit": credits,
                "balance": currentBalance
            }
        )
    })
    return ledgerInfo
}

const debugData = {
    "status": "success",
    "data": [
        {
            "id": "1",
            "date": "Jun 9, 2025",
            "transaction": {
                "description": "birthday gifts",
                "debit": [
                    {
                        "particular": "Wallet",
                        "amount": 500,
                        "remark": "from ma"
                    },
                    {
                        "particular": "Wallet",
                        "amount": 100,
                        "remark": "from baba"
                    }
                ],
                "credit": [
                    {
                        "particular": "Capital",
                        "amount": 600,
                        "remark": ""
                    }
                ]
            }
        },
        {
            "id": "2",
            "date": "Jun 9, 2025",
            "transaction": {
                "description": "Initialisation",
                "debit": [
                    {
                        "particular": "Wallet",
                        "amount": 158,
                        "remark": "wallet"
                    },
                    {
                        "particular": "Online Money",
                        "amount": 1817.42,
                        "remark": "bKash"
                    },
                    {
                        "particular": "Bank",
                        "amount": 13853,
                        "remark": "UCB"
                    },
                    {
                        "particular": "Receivable",
                        "amount": 6000,
                        "remark": "phone cost"
                    }
                ],
                "credit": [
                    {
                        "particular": "Capital",
                        "amount": 21828.42,
                        "remark": ""
                    }
                ]
            }
        },
        {
            "id": "3",
            "date": "Jun 10, 2025",
            "transaction": {
                "description": "",
                "debit": [
                    {
                        "particular": "Capital",
                        "amount": 104,
                        "remark": ""
                    }
                ],
                "credit": [
                    {
                        "particular": "Wallet",
                        "amount": 50,
                        "remark": "lemonade"
                    },
                    {
                        "particular": "Online Money",
                        "amount": 54,
                        "remark": "flexiload"
                    }
                ]
            }
        },
        {
            "id": "4",
            "date": "Jun 11, 2025",
            "transaction": {
                "description": "movie expenses",
                "debit": [
                    {
                        "particular": "Capital",
                        "amount": 160,
                        "remark": ""
                    }
                ],
                "credit": [
                    {
                        "particular": "Wallet",
                        "amount": 10,
                        "remark": "auto fair"
                    },
                    {
                        "particular": "Wallet",
                        "amount": 150,
                        "remark": "taandob ticket fee"
                    }
                ]
            }
        }
    ]
}

// console.log(currentBalance(debugData, "Wallet"))
// console.log(getLedger(debugData.data, "Wallet"))
