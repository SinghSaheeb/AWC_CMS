// Function to append query parameters for GET requests
function appendQueryParameters(url, params) {
    if (params) {
        const queryString = $.param(params); // Convert object to query string
        return url + '?' + queryString; // Return updated URL
    }
    return url; // Return original URL if no params
}

// Common function to load data from an API and populate a select dropdown
function loadDropdown(apiUrl, dropdownId, dataParameters, valueField, textField) {
    // Append query parameters for GET requests
    const urlWithParams = appendQueryParameters(apiUrl, dataParameters);

    $.ajax({
        url: urlWithParams,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        success: function (data) {
            var dropdown = $(dropdownId);
            dropdown.empty(); // Clear existing options

            // Check if data is an array and has valid items
            if (Array.isArray(data) && data.length > 0) {
                let hasValidData = false; // Flag to check for valid data
                dropdown.append('<option value="">Select</option>'); // Default option

                data.forEach(function (item) {
                    // Validate if the item has the expected fields
                    if (item[valueField] !== undefined && item[textField] !== undefined) {
                        dropdown.append(`<option value="${item[valueField]}">${item[textField]}</option>`);
                        hasValidData = true; // Mark that we have valid data
                    }
                });

                // If no valid data was found, provide a message
                if (!hasValidData) {
                    dropdown.append('<option value="">Invalid data available</option>');
                }
            } else {
                dropdown.append('<option value="">No data available</option>'); // Option for no data
            }
        },
        error: function (error) {
            console.error(`Error fetching data from ${urlWithParams}:`, error);
        }
    });
}

// Universal function to get the selected value and text from a <select> element
function getSelectedOption(selectId) {
    var selectedOption = $(selectId).find('option:selected'); // Get the selected option
    var selectedValue = selectedOption.val(); // Get the value
    var selectedText = selectedOption.text(); // Get the text
    return {
        value: selectedValue,
        text: selectedText
    }; // Return an object containing both value and text
}

// Function to change the "Select" option to "All" if it exists
function changeSelectToAllInOption(selectId) {
    const selectElement = $(selectId); // Using jQuery to select the element
    const emptyOption = selectElement.find('option[value=""]'); // Find the option with an empty value

    if (emptyOption.length) {
        emptyOption.text('All'); // Change the text of the empty option
        emptyOption.val(''); // Optionally change the value as well
    }
}

function hasOptions(selectElement) {
    return $(selectElement).find('option').length > 0;
}

function removeRowFromDataTable(tableId, row) {
    var table = $(tableId).DataTable(); // Get the DataTable instance
    table.row(row).remove().draw(); // Remove the row from the table and redraw the table
}