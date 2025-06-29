export const deployment_id = localStorage.getItem('development_key')
export const url = `https://script.google.com/macros/s/${deployment_id}/exec`

export function getLastTransaction() {
    return axios({
        url: `${url}?method=get`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.log("---------Monager Error---------")
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    });
}

export function postNewTransaction(transactionData) {
    return axios({
        url: `${url}?method=post&data=${JSON.stringify(transactionData)}`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log("---------Monager Error---------")
            console.error('Error:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw error;
        });
}
