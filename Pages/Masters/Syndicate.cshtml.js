$(document).ready(function () {
    // Initialize DataTable
    $('#syndicateTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });

    // Load divisions into the select dropdown
    loadDivisions();

    // Load syndicates on page load
    loadSyndicates();

    // Function to load divisions into the dropdown
    function loadDivisions() {
        loadDropdown('/api/divisions', '#divisionId', {}, 'Id', 'DivisionName');
    }

    // Load syndicates into the table
    function loadSyndicates() {
        $.ajax({
            url: '/api/syndicates',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            // Pass syndicate parameters as query string
            data: {
                Id: '',
                DivisionId: '',
                SyndicateName: ''
            },
            success: function (data) {
                var table = $('#syndicateTable').DataTable();
                table.clear(); // Clear existing data
                data.forEach(function (syndicate, index) {
                    table.row.add([
                        index + 1,
                        syndicate.DivisionName,
                        syndicate.Strength,
                        syndicate.SyndicateName,
                        `
                                <button class="btn btn-warning edit-btn" data-id="${syndicate.Id}" data-divisionid="${syndicate.DivisionId}" data-strength="${syndicate.Strength}" data-syndicatename="${syndicate.SyndicateName}"><i class="bi bi-pencil"></i></button>
                                <button class="btn btn-danger delete-btn" data-id="${syndicate.Id}"><i class="bi bi-trash"></i></button>
                                `
                    ]).draw();
                });
            },
            error: function (error) {
                console.error("Error fetching syndicates:", error);
            }
        });
    }

    // Show modal for adding a new syndicate
    $('#addSyndicateBtn').click(function () {
        $('#syndicateForm')[0].reset();
        $('#syndicateId').val(''); // Clear the hidden ID field
        $('#syndicateModalLabel').text('Add Syndicate'); // Set title for adding
        $('#syndicateModal').modal('show');
    });

    // Handle form submission for adding/editing a syndicate
    $('#syndicateForm').submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        var id = $('#syndicateId').val();
        var divisionId = $('#divisionId').val();
        var strength = $('#strength').val();
        var syndicateName = $('#syndicateName').val();
        var actionUrl = id ? `/api/syndicates` : '/api/syndicates';

        $.ajax({
            url: actionUrl,
            type: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify({
                Id: id,
                DivisionId: divisionId,
                Strength: strength,
                SyndicateName: syndicateName
            }),
            success: function (response) {
                alert(response.message, id ? 'info' : 'success');
                $('#syndicateModal').modal('hide');
                loadSyndicates(); // Reload syndicates
            },
            error: function (error) {
                alert("Error saving syndicates: " + error.responseText, 'error');
                console.error("Error saving syndicates:", error);
            }
        });
    });

    // Handle edit button click
    $(document).on('click', '.edit-btn', function () {
        var id = $(this).data('id');
        var division = $(this).data('divisionid');
        var strength = $(this).data('strength');
        var syndicateName = $(this).data('syndicatename');

        $('#syndicateId').val(id);
        $('#divisionId').val(division);
        $('#strength').val(strength);
        $('#syndicateName').val(syndicateName);
        $('#syndicateModalLabel').text('Edit Syndicate'); // Set title for editing
        $('#syndicateModal').modal('show');
    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');
        if (confirm('Are you sure you want to delete this syndicate?')) {
            $.ajax({
                url: `/api/syndicates`,
                type: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                },
                data: JSON.stringify({ Id: id }),
                success: function (response) {
                    alert(response.message, 'warning');
                    loadSyndicates(); // Reload syndicates
                },
                error: function (error) {
                    alert("Error deleting syndicates: " + error.responseText, 'error');
                    console.error("Error deleting syndicates:", error);
                }
            });
        }
    });
});