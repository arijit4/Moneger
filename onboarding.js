const faqs = [
    {
        "label": "How to get the DB-URL?",
        "content": "Follow the below easy steps to continue. Don't worry, you just need to do these only once." + "\n" +
            "- Create a new `Google Sheet` into your Google Drive. Use the WebApp of Google Sheet as App-script may not be available in other\n" +
            "- Click `Extensions > App Script`\n" +
            "- Copy the code from the [DB_Code.js](./DB_Code.js) file and paste that into the `Code.gs` file.\n" +
            "- Click `Deploy > New deployment`\n" +
            "- Set `Select type` as `Web app`\n" +
            "- Set `Who has access` to `Anyone`\n" +
            "- At last, click `Deploy`\n" +
            "- Copy the `Deployment ID` that you see now.\n" +
            "- Paste it in the `Deployment ID` field above\n" +
            "Now you can use the app."
    },
    {
        "label": "Is this app safe?",
        "content": "Of course. Not a single bit of your precious information is sent anywhere. " +
            "Even `Google Drive` is being used as the Database for this app. So, every information is " +
            "stored in and fetched from your Google Drive account."
    },
    {
        "label": "Why is it safe to connect my Google account with this app?",
        "content": "Technically, you are not connecting THIS APP to your Google account. You are connecting the `App Script` " +
            "with the `Google Sheet`, both of which are products of Google and no way THIS APP can access them. " +
            "THIS APP simple makes api calls to google locally."
    }
]

const keys = {
    "development": "development_key",
    "user_name": "user_name_key"
}

faqs.map(faq => {
    return `
    <details>
            <summary role="button" class="outline">${faq.label}</summary>
            <div>${marked.parse(faq.content)}</div>
        </details>`
}).forEach(faq => {
    $('#faq-card').append(faq)
})

$('#dep-id-confirm').click(function () {
    const dep_id = $('#dep-id-field').val()

    if (dep_id.trim().length > 10) {
        localStorage.setItem(keys.development, dep_id)
        localStorage.setItem(keys.user_name, $('#user-name-field').val())
        window.location.href = 'index.html'  // Add this line to redirect
    } else {
        alert('Please enter a valid DEPLOYMENT ID')
    }
})