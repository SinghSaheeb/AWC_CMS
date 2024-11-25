// Universal function to update row numbers for any table
function updateRowNumbers(tableSelector) {
    $(tableSelector + ' tbody tr').each((index, row) => {
        $(row).find('.row-number').text(index + 1);
    });
}

function getDateOnly(timestamp) {
    // Ensure the timestamp is in UTC
    var date = new Date(timestamp + 'Z'); // Add 'Z' to indicate UTC time

    // Extract UTC values
    var year = date.getUTCFullYear();
    var month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Month is 0-indexed
    var day = ('0' + date.getUTCDate()).slice(-2);

    return year + '-' + month + '-' + day;
}

// Function to set cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set cookie expiration
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; SameSite=Lax; Secure";
}

function gatherTableData(tableSelector, headers, targetArray) {
    const headerIndices = {};

    // Determine the indices of the headers
    $(tableSelector + ' thead th').each(function (index) {
        const headerText = $(this).text().trim();
        if (headers.includes(headerText)) {
            headerIndices[headerText] = index; // Store the index for the header
        }
    });

    // Gather data from the rows
    $(tableSelector + ' tbody tr').each(function () {
        const rowData = {};
        headers.forEach(header => {
            const columnIndex = headerIndices[header];
            if (columnIndex !== undefined) {
                rowData[header] = $(this).find('td').eq(columnIndex).text().trim();
            }
        });
        targetArray.push(rowData); // Push the mapped row data to the target array
    });
}

function getInputValue(input) {
    if (input.is('select')) {
        // Multi-select handling
        if (input.attr('multiple')) {
            return input.find('option:selected').map(function () {
                return $(this).text();
            }).get().join(', ');
        } else {
            return input.find('option:selected').text();
        }
    } else if (input.is(':checkbox')) {
        return input.is(':checked');
    } else if (input.is(':radio')) {
        // Radio button handling
        return $('input[name="' + input.attr('name') + '"]:checked').val();
    } else if (input.is('textarea')) {
        return input.val().trim();
    } else if (input.is('[type="file"]')) {
        // File input handling, returning file names as a comma-separated string
        return input[0].files.length > 0
            ? Array.from(input[0].files).map(file => file.name).join(', ')
            : 'No file selected';
    } else if (input.is('[type="date"]') || input.is('[type="time"]') || input.is('[type="datetime-local"]')) {
        // Date and time inputs
        return input.val() || 'Not set';
    } else if (input.is('[type="number"]')) {
        // Number input with validation to ensure a numeric value
        return isNaN(input.val()) ? 'Invalid number' : input.val();
    } else if (input.is('[type="range"]')) {
        // Range input handling
        return input.val();
    } else if (input.is('[type="email"]')) {
        // Email input with basic validation
        return input.val().trim().toLowerCase();
    } else if (input.is('[type="url"]')) {
        // URL input
        return input.val().trim();
    } else if (input.is('[type="hidden"]')) {
        // Handling for hidden inputs
        return input.val().trim();
    } else {
        // Fallback for all other input types (e.g., text, password)
        return input.val().trim();
    }
}

// Function to validate a single input and return its validity status
function validateAndSetStatus(input) {
    validateInputElement(input);
    return !$(input).hasClass('is-invalid'); // Return true if not invalid
}

// Function to validate multiple inputs and return their collective validity status
function areInputsValid(inputs) {
    return inputs.every(input => validateAndSetStatus(input));
}

// General validation function
function validateInputElement(element) {
    const inputID = $(element).attr('id');
    let isValid = true;

    if ($(element).is('input[type="text"], textarea')) {
        // Handle text input and textarea
        const inputValue = $(element).val().trim();
        if (inputValue === '') {
            isValid = false;
            console.warn(`Input with ID "${inputID}" is invalid: Empty value`);
        }
    } else if ($(element).is('input[type="password"]')) {
        // Handle password input
        const passwordValue = $(element).val();
        if (passwordValue.length < 6) { // Example validation: minimum length
            isValid = false;
            console.warn(`Input with ID "${inputID}" is invalid: Password too short`);
        }
    } else if ($(element).is('input[type="email"]')) {
        // Handle email input
        const emailValue = $(element).val();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailValue)) {
            isValid = false;
            console.warn(`Input with ID "${inputID}" is invalid: Invalid email format`);
        }
    } else if ($(element).is('input[type="number"]')) {
        // Handle number input
        const numberValue = $(element).val();
        if (isNaN(numberValue) || numberValue === '') {
            isValid = false;
            console.warn(`Input with ID "${inputID}" is invalid: Not a valid number`);
        }
    } else if ($(element).is('input[type="checkbox"]')) {
        // Handle checkbox
        const isChecked = $(element).is(':checked');
        if (!isChecked) {
            isValid = false;
            console.warn(`Checkbox with ID "${inputID}" is invalid: Not checked`);
        }
    } else if ($(element).is('input[type="radio"]')) {
        // Handle radio button group
        const radioName = $(element).attr('name');
        const isAnyChecked = $(`input[name="${radioName}"]:checked`).length > 0;

        if (!isAnyChecked) {
            isValid = false;
            console.warn(`Radio button group "${radioName}" is invalid: No option selected`);

            // Add 'is-invalid' class to all radio buttons in the group
            $(`input[name="${radioName}"]`).addClass('is-invalid');
        } else {
            // Remove 'is-invalid' class from all radio buttons in the group
            $(`input[name="${radioName}"]`).removeClass('is-invalid');
        }
    } else if ($(element).is('select')) {
        // Handle select element
        const selectValue = $(element).val();
        if (selectValue === '') {
            isValid = false;
            console.warn(`Select with ID "${inputID}" is invalid: No value selected`);
        }
    } else if ($(element).is('input[type="url"]')) {
        // Handle URL input
        const urlValue = $(element).val();
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlPattern.test(urlValue)) {
            isValid = false;
            console.warn(`Input with ID "${inputID}" is invalid: Invalid URL format`);
        }
    } else if ($(element).is('input[type="tel"]')) {
        // Handle telephone input
        const telValue = $(element).val();
        const telPattern = /^\+?[0-9]{7,}$/; // Example pattern for valid phone numbers
        if (!telPattern.test(telValue)) {
            isValid = false;
            console.warn(`Input with ID "${inputID}" is invalid: Invalid telephone format`);
        }
    } else if ($(element).is('input[type="date"], input[type="month"], input[type="week"], input[type="time"], input[type="datetime-local"]')) {
        // Handle date, month, week, time, datetime-local input
        const dateValue = $(element).val();
        if (!dateValue) {
            isValid = false;
            console.warn(`Input with ID "${inputID}" is invalid: No date selected`);
        }
    } else if ($(element).is('input[type="color"]')) {
        // Handle color input
        const colorValue = $(element).val();
        if (!/^#[0-9A-F]{6}$/i.test(colorValue)) {
            isValid = false;
            console.warn(`Input with ID "${inputID}" is invalid: Invalid color format`);
        }
    }

    // Add or remove the invalid class based on validation result
    if (isValid) {
        $(element).removeClass('is-invalid');
    } else {
        $(element).addClass('is-invalid');
    }
}

// Function to clear and reset the state of input fields
function resetInputs(inputs) {
    inputs.forEach(input => {
        $(input).val('').removeClass('is-invalid'); // Clear input and remove invalid class
    });
}

// Function to create a new table cell with optional content
function createTableCell(input = null) {
    const cell = $('<td>');

    // If input is provided, get its value using getInputValue
    if (input) {
        const content = getInputValue(input);
        cell.text(content);

        // Check if the input type is hidden
        if (input.attr('type') === 'hidden') {
            cell.addClass('d-none'); // Add the d-none class if the input is hidden
        }
    }

    return cell;
}

// Function to create a delete button for each row
function createDeleteButton() {
    return $('<button>')
        .addClass('btn btn-danger btn-sm delete-row')
        .html('<i class="bi bi-trash"></i>')
        .on('click', handleDeleteRow);
}

// Event handler to delete a row and update row numbers
function handleDeleteRow() {
    const tableSelector = $(this).closest('table').attr('id'); // Get the ID of the closest table
    $(this).closest('tr').remove();
    updateRowNumbers(`#${tableSelector}`); // Update row numbers for the corresponding table
}