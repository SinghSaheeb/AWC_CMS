$(document).ready(function () {
	// Initialize DataTable
	var table = $('#deploymentDirectingStaffTable').DataTable({
		paging: true,
		searching: true,
		ordering: true
	});

	// Load base courses on page load
	loadDirectingStaff();

	// Load base courses into the table
	function loadDirectingStaff() {
		// Get the current page index
		var currentPage = table.page();

		$.ajax({
			url: '/api/deployment/directingstaffs',
			type: 'GET',
			headers: {
				'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
			},
			success: function (data) {
				table.clear(); // Clear existing data

				if (Array.isArray(data) && data.length > 0) { // Check if data is not empty
					data.forEach(function (obj, index) {
						table.row.add([
							index + 1,
							obj.TrainingYearName,
							obj.CourseName,
							obj.TutorialName,
							obj.DivisionName,
							obj.SyndicateName,
							obj.DirectingStaffName,
							`
                                    <button class="btn btn-warning edit-btn"  data-id="${obj.Id}" 
												data-officerid="${obj.OfficerId}" 
												data-divisionid="${obj.DivisionId}" 
												data-courseid="${obj.CourseId}"
												data-trainingyearid="${obj.TrainingYearId}"
												data-tutorialid="${obj.TutorialId}"
												data-syndicateid="${obj.SyndicateId}"><i class="bi bi-pencil"></i></button>
                                    <button class="btn btn-danger delete-btn" data-id="${obj.Id}"><i class="bi bi-trash"></i></button>
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
				console.error("Error fetching base courses:", error);
			}
		});
	}

	// Show modal for adding a new base course
	$('#addDeploymentDirectingStaffBtn').click(function () {
		$('#deploymentDirectingStaffForm')[0].reset();
		$('#directingStaffId').val('');
		$('#directingStaffModalLabel').text('Add Deployment for Senior Instructor');
		$('#directingStaffModal').modal('show');
	});

	// Handle form submission for adding/editing directing staff
	$('#deploymentDirectingStaffForm').submit(function (event) {
		event.preventDefault();
		var id = $('#directingStaffId').val();
		var directingStaffId = $('#ddlDirectingStaff').val();
		var divisionId = $('#ddlDivision').val();
		var courseId = $('#ddlCourse').val();
		var trainingYearId = $('#ddlTrainingYear').val();
		var tutorialId = $('#ddlTutorial').val();
		var syndicateId = $('#ddlSyndicate').val();
		var actionUrl = '/api/deployment/directingstaffs';

		// Prepare the data object
		var data = {
			Id: id ? id : null, // Send null if it's a new directing staff
			OfficerId: directingStaffId,
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
				$('#directingStaffModal').modal('hide');
				loadDirectingStaff(); // Reload directing staff
			},
			error: function (error) {
				alert("Error saving directing staff: " + error.responseText, 'error');
				console.error("Error saving directing staff: ", error.responseText);
			}
		});
	});

	// Handle edit button click
	$(document).on('click', '.edit-btn', function () {
		var directingStaffId = $(this).data('officerid');
		var divisionId = $(this).data('divisionid');
		var courseId = $(this).data('courseid');
		var trainingYearId = $(this).data('trainingyearid');
		var tutorialId = $(this).data('tutorialid');
		var syndicateId = $(this).data('syndicateid');
		var id = $(this).data('id');

		$('#directingStaffId').val(id);
		$('#ddlDirectingStaff').val(directingStaffId);
		$('#ddlDivision').val(divisionId);
		$('#ddlCourse').val(courseId);
		$('#ddlTrainingYear').val(trainingYearId);
		$('#ddlTutorial').val(tutorialId);
		$('#ddlSyndicate').val(syndicateId);

		$('#directingStaffModalLabel').text('Edit Deployment for Directing Staff');
		$('#directingStaffModal').modal('show');
	});

	// Handle delete button click
	$(document).on('click', '.delete-btn', function () {
		var id = $(this).data('id');
		var row = $(this).closest('tr');
		if (confirm('Are you sure you want to delete this directing staff deployment?')) {
			$.ajax({
				url: '/api/deployment/directingstaffs',
				type: 'DELETE',
				contentType: 'application/json',
				headers: {
					'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
				},
				data: JSON.stringify({
					Id: id
				}),
				success: function (response) {
					alert(response.message, 'warning');

					// Call the universal method to remove the row
					removeRowFromDataTable('#deploymentDirectingStaffTable', row);

					loadDirectingStaff(); // Reload table data
				},
				error: function (error) {
					alert("Error deleting directing staff: " + error.responseText, 'error');
					console.error("Error deleting directing staff: ", error.responseText);
				}
			});
		}
	});
});