$(document).ready(function () {
    // Initialize DataTable
    var table = $('#dataTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });

    // Load maestro into the select dropdown
    loadMaestros();

    // Load maestro dbset into the table on page load
    fetchDataAndPopulateTable(null);

    // Show modal for adding a new maestro
    $('#addBtn').click(function () {
        var maestroSelected = getSelectedOption('#maestro');

        if (maestroSelected.value) {
            $('#maestroForm')[0].reset();
            $('#maestroAlias').val(maestroSelected.text);
            $('#maestroModalLabel').text('Add Maestro\'s ' + maestroSelected.text + ' Value');
            $('#maestroValueLabel').text('Maestro\'s ' + maestroSelected.text + ' Value');
            $('#maestroModal').modal('show');
        } else {
            alert("Please select a Maestro before proceeding.", 'warning');
        }
    });

    // Handle form submission for adding/editing a maestro
    $('#maestroForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        var id = $('#maestroId').val();
        var alias = $('#maestroAlias').val();
        var maestroValue = $('#maestroValue').val();
        var actionUrl = '/api/maestros';
        var actionType = id ? 'PUT' : 'POST';

        // Prepare the data object
        var data = {
            Id: id ? id : null,
            Alias: alias,
            ColumnValue: maestroValue
        };

        $.ajax({
            url: actionUrl,
            type: actionType, // Use PUT for update, POST for add
            contentType: 'application/json', // Specify the content type
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() // CSRF token
            },
            data: JSON.stringify(data), // Convert the data object to JSON
            success: function (response) {
                alert(response.message, id ? 'info' : 'success'); // Show appropriate message
                $('#maestroModal').modal('hide'); // Hide the modal
                $('#searchBtn').trigger('click'); // Reload datatable
            },
            error: function (error) {
                alert("Error saving maestro: " + error.responseText, 'error'); // Show error message
                console.error("Error saving maestro: ", error.responseText);
            }
        });
    });

    // Example usage
    $('#searchBtn').click(function () {
        var maestroSelected = getSelectedOption('#maestro'); // Call the function to get the selected Id
        fetchDataAndPopulateTable(maestroSelected.value); // Pass the Id to your data-fetching function if needed
    });

    // Function to load maestros into the dropdown
    function loadMaestros() {
        // Load dropdown options
        loadDropdown('/api/maestros', '#maestro', {}, 'Id', 'Alias');
    }

    function fetchDataAndPopulateTable(maestroId) {
        var apiUrl = '/api/maestros/dbset';
        var dataParameters = {};

        // Check if maestroId is not null or undefined, then add it to dataParameters
        if (maestroId) {
            dataParameters.Id = maestroId; // Add maestroId to the dataParameters
        }

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
                var currentPage = table.page(); // Get the current page index
                table.clear(); // Clear existing data

                if (Array.isArray(data) && data.length > 0) { // Check if data is not empty

                    data.forEach(function (item, index) {
                        table.row.add([
                            index + 1,
                            item.AliasKey,
                            item.AliasValue,
                            `
                                        <button class="btn btn-warning edit-btn" data-id="${item.Id}" data-alias="${item.AliasKey}" data-maestrovalue="${item.AliasValue}"><i class="bi bi-pencil"></i></button>
                                        <button class="btn btn-danger delete-btn" data-id="${item.Id}" data-alias="${item.AliasKey}"><i class="bi bi-trash"></i></button>
                                    `
                        ]);
                    });

                    table.draw(false).page(currentPage).draw(false); // Restore current page after reload
                } else {
                    console.warn("Data is not an array or is empty.");
                }
            },
            error: function (error) {
                console.error("Error fetching maestros:", error);
            }
        });
    }

    // Handle edit button click
    $(document).on('click', '.edit-btn', function () {
        var id = $(this).data('id');
        var alias = $(this).data('alias');
        var maestroValue = $(this).data('maestrovalue');

        $('#maestroId').val(id);
        $('#maestroAlias').val(alias);
        $('#maestroValue').val(maestroValue);
        $('#maestroModalLabel').text('Edit Maestro\'s ' + alias + ' Value');
        $('#maestroValueLabel').text('Maestro\'s ' + alias + ' Value');
        $('#maestroModal').modal('show');
    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');
        var alias = $(this).data('alias');

        if (confirm('Are you sure you want to delete this maestro?')) {
            $.ajax({
                url: `/api/maestros`,
                type: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                },
                data: JSON.stringify({ Id: id, Alias: alias }),
                success: function (response) {
                    alert(response.message, 'warning');
                    $('#searchBtn').trigger('click'); // Reload datatable
                },
                error: function (error) {
                    alert("Error deleting maestro: " + error.responseText, 'error');
                    console.error("Error deleting maestro: ", error.responseText);
                }
            });
        }
    });
});