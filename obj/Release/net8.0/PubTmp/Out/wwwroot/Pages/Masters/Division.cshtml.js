$(document).ready(function () {
    // Initialize DataTable
    var table = $('#divisionTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });

    // Load divisions on page load
    loadDivisions();

    // Load divisions into the table
    function loadDivisions() {
        $.ajax({
            url: '/api/divisions',
            type: 'GET',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            success: function (data) {
                // Get the current page index
                var currentPage = table.page();
                table.clear(); // Clear existing data

                if (Array.isArray(data) && data.length > 0) { // Check if data is not empty
                    data.forEach(function (division, index) {
                        table.row.add([
                            index + 1,
                            division.Wing,
                            division.DivisionName,
                            `
                                <button class="btn btn-warning edit-btn" data-id="${division.Id}" data-wing="${division.Wing}" data-divisionname="${division.DivisionName}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-danger delete-btn" data-id="${division.Id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            `
                        ]);
                    });

                    // Redraw the table and keep the same page
                    table.draw(false).page(currentPage).draw(false);
                } else {
                    console.warn("Data is not an array or is empty.");
                }
            },
            error: function (error) {
                console.error("Error fetching divisions:", error);
            }
        });
    }

    // Show modal for adding a new division
    $('#addDivisionBtn').click(function () {
        $('#divisionForm')[0].reset();
        $('#divisionId').val('');
        $('#divisionModalLabel').text('Add Division');
        $('#divisionModal').modal('show');
    });

    // Handle form submission for adding/editing a division
    $('#divisionForm').submit(function (event) {
        event.preventDefault();
        var id = $('#divisionId').val();
        var wing = $('#wingId option:selected').text();
        var divisionName = $('#divisionName').val();
        var actionUrl = '/api/divisions';

        $.ajax({
            url: actionUrl,
            type: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify({
                Id: id,
                Wing: wing,
                DivisionName: divisionName
            }),
            success: function (response) {
                alert(response.message, id ? 'info' : 'success');
                $('#divisionModal').modal('hide');
                loadDivisions(); // Reload divisions
            },
            error: function (error) {
                alert("Error saving division: " + error.responseText, 'error');
            }
        });
    });

    // Handle edit button click
    $(document).on('click', '.edit-btn', function () {
        var id = $(this).data('id');
        var wing = $(this).data('wing');
        var divisionName = $(this).data('divisionname');

        $('#divisionId').val(id);
        var wing = $(this).data('wing');
        $('#wingId option').each(function () {
            if ($(this).text() === wing) {
                $(this).prop('selected', true);
            }
        });
        $('#divisionName').val(divisionName);
        $('#divisionModalLabel').text('Edit Division');
        $('#divisionModal').modal('show');
    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');

        if (confirm('Are you sure you want to delete this division?')) {
            $.ajax({
                url: `/api/divisions`,
                type: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                },
                data: JSON.stringify({ Id: id }),
                success: function (response) {
                    alert(response.message, 'warning');
                    loadDivisions(); // Reload divisions
                },
                error: function (error) {
                    alert("Error deleting division: " + error.responseText, 'error');
                }
            });
        }
    });
});