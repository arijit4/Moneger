function doGet(req) {
    if (req.parameter !== null) {
        var method = req.parameter.method.toLowerCase()

        // get, post and put requsts are all maintained within the `doGet` method
        // as the other `doSmth` methods are buggy (at least for me :|   )

        if (method === "get") return get(req) // done for last transaction
        else if (method === "post") return post(req)
        else if (method === "put") return put(req)

        else return JSON_to_string({"status": "failed", "reason": "invalid method"})
    }
}

/** @Structure of data object which is sent in a POST request.
 {
     date: String,
     transactions: {
         debit: [
             {
                 particular: String,
                 amount: Double,
                 remark: String
             }
         ],
         credit: [
             {
                 particular: String,
                 amount: Double,
                 remark: String
             }
         ]
     }
 }
 */

// Utility function to prepare JSON response
function JSON_to_string(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON)
}

// Get the active sheet
function getSheet() {
    return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

// Get all data as objects
function getDataAsObjects(dataLimit = 10) {
    var sheet = getSheet()

    const all_row = sheet.getDataRange().getValues();

    var result = [];
    for (let i = Math.max(1, all_row.length - dataLimit); i < all_row.length; i++) {
        var last_row = all_row[i]

        let dataObj = {
            "id": last_row[0].toString(),
            "date": last_row[1].toString(),
            "transaction": {
                "description": last_row[2].toString(),
                "debit": JSON.parse(last_row[3]),
                "credit": JSON.parse(last_row[4]),
            }
        }
        result.push(dataObj)
    }

    console.log(JSON.stringify(result))
    return result
}

// Implementation of GET method
function get(req) {
    try {
        const data = getDataAsObjects();
        return JSON_to_string({
            status: "success",
            data: data
        });
    } catch (error) {
        return JSON_to_string({
            status: "failed",
            reason: error.toString()
        });
    }
}

// Implementation of POST method
function post(req) {
    try {
        const sheet = getSheet();
        const all_row = sheet.getDataRange().getValues();
        const last_row = all_row[all_row.length - 1];

        const debugData = JSON.parse("{\"id\":\"1\",\"date\":\"2 June\",\"transaction\":{\"remark\":\"baler kenakata\",\"debit\":[{\"part\":\"bal\",\"amount\":\"sal\"}],\"credit\":[{\"part\":\"bal\",\"amount\":\"sal\"}]}}")

        // const data = debugData
        const data = JSON.parse(req.parameter.data);

        // Validate required fields
        if (!data.date || !data.transaction) {
            console.log("failed in pre-check")
            return JSON_to_string({
                status: "failed",
                reason: "Missing required fields"
            });
        }

        // Format data for insertion

        const newRow = [
            (all_row.length === 1 ? 1 : last_row[0] + 1),
            "'" + data.date,
            data.transaction.description,
            JSON.stringify(data.transaction.debit),
            JSON.stringify(data.transaction.credit)
        ];

        // Append the new row
        sheet.appendRow(newRow);
        console.log("success")
        return JSON_to_string({
            status: "success",
            message: "Data added successfully"
        });
    } catch (error) {
        console.log("failed\nerror:" + error)
        return JSON_to_string({
            status: "failed",
            reason: error.toString()
        });
    }
}

// Implementation of PUT method
function put(req) {
    try {
        const sheet = getSheet();
        const data = JSON.parse(req.parameter.data);
        const rowId = parseInt(req.parameter.rowId);

        if (!rowId || !data) {
            throw new Error("Missing rowId or data");
        }

        // Get the row to update
        const range = sheet.getRange(rowId, 1, 1, 5);

        // Update the row with new values
        const updatedValues = [
            data.date,
            data.transactions.debit.particular,
            data.transactions.debit.amount,
            data.transactions.credit.particular,
            data.transactions.credit.amount
        ];

        range.setValues([updatedValues]);

        return JSON_to_string({
            status: "success",
            message: "Data updated successfully"
        });
    } catch (error) {
        return JSON_to_string({
            status: "failed",
            reason: error.toString()
        });
    }
}