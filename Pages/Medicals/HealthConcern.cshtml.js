$(document).ready(function () {
    // Initialize DataTable
    var table = $('#healthConcernTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });


    // Load healthconcern on page load
    loadhealthconcern();

    // Load healthconcern into the table
    function loadhealthconcern() {
        var personalNumber = $('#lblPersonalNumber').text();
        var formData = { PersonalNumber: personalNumber };

        $.ajax({
            url: '/api/medicals',
            type: 'GET',
            data: JSON.stringify(formData),
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            success: function (data) {
                // Clear existing data
                table.clear();
                if (Array.isArray(data) && data.length > 0) { // Check if data is not empty
                    data.forEach(function (obj, index) {
                        // Add the main row to the table
                        table.row.add([
                            index + 1,
                            new Date(obj.CreatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                            obj.Issue,
                            obj.Diagnosis,
                            `
                                        <button class="btn btn-warning edit-btn"
                                                data-id="${obj.Id}"
                                                data-issue="${obj.Issue}">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                       
                                        <button class="btn btn-danger delete-btn"
                                                data-id="${obj.Id}">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    `]).draw().node();
                    });
                }
            },
            error: function (error) {
                console.error("Error fetching users:", error);
            }
        });
    }


    // Handle delete button click
    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');

        if (confirm('Are you sure you want to delete this health concern?')) {
            $.ajax({
                url: `/api/medicals`,
                type: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                },
                data: JSON.stringify({ Id: id }),
                success: function (response) {
                    alert(response.message, 'warning');
                    loadhealthconcern(); // Reload health concern
                },
                error: function (error) {
                    alert("Error deleting health concern: " + error.responseText, 'error');
                    console.error("Error deleting health concern: ", error.responseText);
                }
            });
        }
    });


    // Handle edit button click
    $(document).on('click', '.edit-btn', function () {
        var id = $(this).data('id');
        var issue = $(this).data('issue');

        $('#healthConcernId').val(id);
        $('#txtIssue').val(issue);

        $('#healthConcernModalLabel').text('Edit Health Concern');
        $('#healthConcernModal').modal('show');
    });


    // Show modal for adding a new Health Concern
    $('#addHealthConcernBtn').click(function () {
        $('#healthConcernForm')[0].reset();
        $('#healthConcernId').val('');
        $('#healthConcernModalLabel').text('Add Health Concern');
        $('#healthConcernModal').modal('show');
    });

    // Handle form submission for adding/editing HealthConcern
    $('#healthConcernForm').submit(function (event) {
        event.preventDefault();
        var id = $('#healthConcernId').val();
        var personalNumber = $('#lblPersonalNumber').text();
        var issue = $('#txtIssue').val();
        var actionUrl = '/api/medical';

        // Prepare the data object
        var formData = {
            Id: id ? id : null, // Send null if it's a new student deployment
            PersonalNumber: personalNumber,
            Issue: issue
        };

        $.ajax({
            url: actionUrl,
            type: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify(formData), // Convert the data object to JSON
            success: function (response) {
                    alert(response.message, id ? 'info' : 'success');
                    $('#healthConcernModal').modal('hide');
                    loadhealthconcern(); // Reload medicals
            },
            error: function (error) {
                alert("Error saving medicals: " + error.responseText, 'error');
                console.error("Error saving medicals: ", error.responseText);
            }
        });
    });
});
