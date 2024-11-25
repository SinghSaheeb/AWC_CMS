$(document).ready(function () {
    // Initialize DataTable
    var table = $('#studentTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });

    // Load students on page load
    loadStudents();

    // Load students into the table
    function loadStudents() {
        $.ajax({
            url: '/api/deployment/students',
            type: 'GET',
            data: JSON.stringify({}),
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            success: function (data) {
                // Clear existing data
                table.clear();

                if (Array.isArray(data) && data.length > 0) { // Check if data is not empty
                    data.forEach(function (obj, index) {
                        // Add the main row to the table
                        var rowNode = table.row.add([
                            `
                                    <!-- Icon button to toggle child row with index -->
                                    <button class="btn btn-primary btn-sm toggle-child-btn" data-index="${index + 1}">
                                        <i class="bi bi-arrow-90deg-down"></i>
                                    </button>
                                    `,
                            obj.Category,
                            obj.PersonalNumber,
                            obj.Rank,
                            obj.FullName,
                            obj.Decoration,
                            obj.Arms,
                            obj.PresentUnit,
                            obj.ParentUnit,
                            `
                                    <div class="d-flex justify-content-center">
                                        <button class="btn btn-warning edit-btn"
                                        data-obj="${obj}"
                                                data-deploymentid="${obj.DeploymentId}"
                                                data-studentid="${obj.StudentId}"
                                                data-category="${obj.Category}"
                                                data-personalnumber="${obj.PersonalNumber}"
                                                data-rank="${obj.Rank}"
                                                data-fullname="${obj.FullName}"
                                                data-presentunit="${obj.PresentUnit}"

                                                data-trainingyearid="${obj.TrainingYearId}"
                                                data-courseid="${obj.CourseId}"
                                                data-tutorialid="${obj.TutorialId}"
                                                data-divisionid="${obj.DivisionId}"
                                                data-syndicateid="${obj.SyndicateId}">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                    </div>
                                    `]).draw().node();

                        // Create a hidden child row for additional details
                        var childRow = `
                                            <div class="container">
                                                <ul class="list-group">
                                                    <li class="list-group-item"><i class="bi bi-calendar text-primary"></i> <b>Training Year:</b> ${obj.TrainingYearName || ''}</li>
                                                    <li class="list-group-item"><i class="bi bi-book text-primary"></i> <b>Course:</b> ${obj.CourseName || ''}</li>
                                                    <li class="list-group-item"><i class="bi bi-file-earmark-text text-primary"></i> <b>Tutorial:</b> ${obj.TutorialName || ''}</li>
                                                    <li class="list-group-item"><i class="bi bi-diagram-2 text-primary"></i> <b>Division:</b> ${obj.DivisionName || ''}</li>
                                                    <li class="list-group-item"><i class="bi bi-people text-primary"></i> <b>Syndicate:</b> ${obj.SyndicateName || ''}</li>
                                                </ul>
                                            </div>
                                        `;

                        // Attach the row click event to toggle the child row (with propagation stop)
                        $(rowNode).on('click', function () {
                            var row = table.row(this);
                            if (row.child.isShown()) {
                                // This row is already open - close it
                                row.child.hide();
                                $(this).removeClass('shown');
                            } else {
                                // Open this row
                                row.child(childRow).show();
                                $(this).addClass('shown');
                            }
                        });

                        // Handle the toggle button click event to toggle child row (prevent propagation)
                        $(rowNode).find('.toggle-child-btn').on('click', function (e) {
                            e.stopPropagation(); // Prevent the click from triggering row click event

                            var row = table.row($(this).closest('tr'));
                            if (row.child.isShown()) {
                                // This row is already open - close it
                                row.child.hide();
                                $(this).find('i').removeClass('bi-arrow-90deg-up').addClass('bi-arrow-90deg-down');
                            } else {
                                // Open this row
                                row.child(childRow).show();
                                $(this).find('i').removeClass('bi-arrow-90deg-down').addClass('bi-arrow-90deg-up');
                            }
                        });

                        // Handle the edit button click event (prevent child row from opening)
                        $(rowNode).find('.edit-btn').on('click', function (e) {
                            e.stopPropagation(); // Prevent the row click event

                            // Handle edit button functionality here
                            var deploymentId = $(this).data('deploymentid');
                            var studentid = $(this).data('studentid');
                            var category = $(this).data('category');
                            var personalNumber = $(this).data('personalnumber');
                            var rank = $(this).data('rank');
                            var fullName = $(this).data('fullname');
                            var presentUnit = $(this).data('presentunit');

                            var trainingYearId = $(this).data('trainingyearid');
                            var courseId = $(this).data('courseid');
                            var tutorialId = $(this).data('tutorialid');
                            var divisionId = $(this).data('divisionid');
                            var syndicateId = $(this).data('syndicateid');

                            $('#deploymentId').val(deploymentId);
                            $('#studentId').val(studentid);
                            $('#lblCategory').text(category);
                            $('#lblPersonalNumber').text(personalNumber);
                            $('#lblRank').text(rank);
                            $('#lblName').text(fullName);
                            $('#lblPresentUnit').text(presentUnit);

                            $('#ddlDivision').val(divisionId);
                            $('#ddlCourse').val(courseId);
                            $('#ddlTrainingYear').val(trainingYearId);
                            $('#ddlTutorial').val(tutorialId);
                            $('#ddlSyndicate').val(syndicateId);

                            $('#studentModalLabel').text("Student's Syndicate Allocation");
                            $('#studentModal').modal('show');
                        });
                    });
                }
            },
            error: function (error) {
                console.error("Error fetching users:", error);
            }
        });
    }

    // Handle form submission for adding/editing student
    $('#studentForm').submit(function (event) {
        event.preventDefault();
        var id = $('#deploymentId').val();
        var studentId = $('#studentId').val();
        var divisionId = $('#ddlDivision').val();
        var courseId = $('#ddlCourse').val();
        var trainingYearId = $('#ddlTrainingYear').val();
        var tutorialId = $('#ddlTutorial').val();
        var syndicateId = $('#ddlSyndicate').val();
        var actionUrl = '/api/deployment/students';

        // Prepare the data object
        var data = {
            Id: id ? id : null, // Send null if it's a new student deployment
            StudentId: studentId,
            DivisionId: divisionId,
            CourseId: courseId,
            TrainingYearId: trainingYearId,
            TutorialId: tutorialId,
            SyndicateId: syndicateId
        };

        $.ajax({
            url: actionUrl,
            type: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify(data), // Convert the data object to JSON
            success: function (response) {
                alert(response.message, id ? 'info' : 'success');
                $('#studentModal').modal('hide');
                loadStudents(); // Reload directing staff
            },
            error: function (error) {
                alert("Error saving directing staff: " + error.responseText, 'error');
                console.error("Error saving directing staff: ", error.responseText);
            }
        });
    });
});