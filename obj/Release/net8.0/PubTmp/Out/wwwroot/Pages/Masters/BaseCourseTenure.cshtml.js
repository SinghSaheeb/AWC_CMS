$(document).ready(function () {
    // Initialize DataTable
    $('#baseCourseTenureTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });

    // Load base course tenures on page load
    loadBaseCourseTenures();

    // Load base course tenures into the table
    function loadBaseCourseTenures() {
        $.ajax({
            url: '/api/basecoursetenures',
            type: 'GET',
            data: JSON.stringify({}),
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            success: function (data) {
                var table = $('#baseCourseTenureTable').DataTable();
                table.clear(); // Clear existing data

                data.forEach(function (tenure, index) {
                    table.row.add([
                        index + 1,
                        tenure.SerialNumber,
                        tenure.BaseCourseName,
                        tenure.Strength,
                        new Date(tenure.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), // Format StartDate
                        new Date(tenure.EndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), // Format EndDate
                        new Date(tenure.RegistrationStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), // Format RegistrationStartDate
                        new Date(tenure.RegistrationEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), // Format RegistrationEndDate
                        tenure.IsActive ? 'Yes' : 'No',
                        `
                                    <button class="btn btn-warning edit-btn" data-id="${tenure.Id}" data-serialnumber="${tenure.SerialNumber}" data-basecourseid="${tenure.BaseCourseId}" data-strength="${tenure.Strength}" data-startdate="${tenure.StartDate}" data-enddate="${tenure.EndDate}" data-regstart="${tenure.RegistrationStartDate}" data-regend="${tenure.RegistrationEndDate}" data-isactive="${tenure.IsActive}">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-danger delete-btn" data-id="${tenure.Id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                `
                    ]).draw();
                });
            },
            error: function (error) {
                console.error("Error fetching base course tenures:", error);
            }
        });
    }

    // Show modal for adding a new base course tenure
    $('#addBaseCourseTenureBtn').click(function () {
        $('#baseCourseTenureForm')[0].reset();
        $('#baseCourseTenureId').val('');
        $('#baseCourseTenureModalLabel').text('Add Base Course Tenure');
        $('#baseCourseTenureModal').modal('show');
    });

    // Handle form submission for adding/editing a base course tenure
    $('#baseCourseTenureForm').submit(function (event) {
        event.preventDefault();
        var id = $('#baseCourseTenureId').val();
        var serialNumber = $('#serialNumber').val();
        var basecourseid = $('#ddlBaseCourse').val();
        var strength = $('#strength').val();
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        var registrationStartDate = $('#registrationStartDate').val();
        var registrationEndDate = $('#registrationEndDate').val();

        // Get the value from the select and convert it to a boolean
        var isActive = $('#isActive').val() === 'true'; // Convert string to boolean

        var actionUrl = '/api/basecoursetenures';

        // Prepare the data object
        var data = {
            Id: id ? id : null,
            SerialNumber: serialNumber,
            BaseCourseId: basecourseid,
            Strength: strength,
            StartDate: startDate,
            EndDate: endDate,
            RegistrationStartDate: registrationStartDate,
            RegistrationEndDate: registrationEndDate,
            IsActive: isActive
        };

        $.ajax({
            url: actionUrl,
            type: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify(data),
            success: function (response) {
                alert(response.message, id ? 'info' : 'success');
                $('#baseCourseTenureModal').modal('hide');
                loadBaseCourseTenures(); // Reload base course tenures
            },
            error: function (error) {
                alert("Error saving base course tenure: " + error.responseText, 'error');
                console.error("Error saving base course tenures:", error.responseText);
            }
        });
    });

    // Handle edit button click
    $(document).on('click', '.edit-btn', function () {
        var id = $(this).data('id');
        var serialNumber = $(this).data('serialnumber');
        var baseCourseId = $(this).data('basecourseid');
        var strength = $(this).data('strength');
        var startDate = $(this).data('startdate').split('T')[0];
        var endDate = $(this).data('enddate').split('T')[0];
        var regStart = $(this).data('regstart').split('T')[0];
        var regEnd = $(this).data('regend').split('T')[0];
        var isActive = JSON.stringify($(this).data('isactive'));

        $('#baseCourseTenureId').val(id);
        $('#serialNumber').val(serialNumber);
        $('#ddlBaseCourse').val(baseCourseId);
        $('#strength').val(strength);
        $('#startDate').val(startDate);
        $('#endDate').val(endDate);
        $('#registrationStartDate').val(regStart);
        $('#registrationEndDate').val(regEnd);
        $('#isActive').val(isActive);
        $('#baseCourseTenureModalLabel').text('Edit Base Course Tenure');
        $('#baseCourseTenureModal').modal('show');
    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');

        if (confirm('Are you sure you want to delete this base course tenure?')) {
            $.ajax({
                url: `/api/basecoursetenures`,
                type: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                },
                data: JSON.stringify({ Id: id }),
                success: function (response) {
                    alert(response.message, 'warning');
                    loadBaseCourseTenures(); // Reload base course tenures
                },
                error: function (error) {
                    alert("Error deleting base course tenure: " + error.responseText, 'error');
                    console.error("Error deleting base course tenures:", error.responseText);
                }
            });
        }
    });
});