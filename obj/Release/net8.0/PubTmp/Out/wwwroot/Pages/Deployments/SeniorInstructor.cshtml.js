
$(document).ready(function () {
	// Initialize DataTable
	$('#deploymentSeniorInstructorTable').DataTable({
		paging: true,
		searching: true,
		ordering: true
	});

	// Load base courses on page load
	loadSeniorInstructors();

	// Load base courses into the table
	function loadSeniorInstructors() {
		$.ajax({
			url: '/api/deployment/seniorinstructors',
			type: 'GET',
			headers: {
				'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
			},
			success: function (data) {
				var table = $('#deploymentSeniorInstructorTable').DataTable();
				table.clear(); // Clear existing data

				if (Array.isArray(data) && data.length > 0) { // Check if data is not empty
					data.forEach(function (obj, index) {
						table.row.add([
							index + 1,
							obj.TrainingYearName,
							obj.CourseName,
							obj.TutorialName,
							obj.DivisionName,
							obj.OfficerName,
							obj.Officiate ? 'Yes' : 'No',
							`
										<button class="btn btn-warning edit-btn" data-id="${obj.Id}" 
												data-officerid="${obj.OfficerId}" 
												data-divisionid="${obj.DivisionId}" 
												data-courseid="${obj.CourseId}"
												data-trainingyearid="${obj.TrainingYearId}"
												data-tutorialid="${obj.TutorialId}"
												data-officiate="${obj.Officiate}">
											<i class="bi bi-pencil"></i>
										</button>
										<button class="btn btn-danger delete-btn" data-id="${obj.Id}">
											<i class="bi bi-trash"></i>
										</button>
									`
						]).draw();
					});
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
	$('#addDeploymentSeniorInstructorBtn').click(function () {
		$('#deploymentSeniorInstructorForm')[0].reset();
		$('#seniorInstructorId').val('');
		$('#seniorInstructorModalLabel').text('Add Deployment for Senior Instructor');
		$('#seniorInstructorModal').modal('show');
	});

	// Handle form submission for adding/editing a senior instructor
	$('#deploymentSeniorInstructorForm').submit(function (event) {
		event.preventDefault();
		var id = $('#seniorInstructorId').val();
		var officerId = $('#ddlSeniorInstructor').val();
		var divisionId = $('#ddlDivision').val();
		var courseId = $('#ddlCourse').val();
		var trainingYearId = $('#ddlTrainingYear').val();
		var tutorialId = $('#ddlTutorial').val();
		var officiate = $('#chkSeniorInstructorOfficiate').is(':checked');
		var actionUrl = '/api/deployment/seniorinstructors';

		// Prepare the data object
		var data = {
			Id: id ? id : null, // Send null if it's a new senior instructor
			OfficerId: officerId,
			DivisionId: divisionId,
			CourseId: courseId,
			TrainingYearId: trainingYearId,
			TutorialId: tutorialId,
			Officiate: officiate
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
				$('#seniorInstructorModal').modal('hide');
				loadSeniorInstructors(); // Reload senior instructors
			},
			error: function (error) {
				alert("Error saving senior instructor: " + error.responseText, 'error');
				console.error("Error saving senior instructor: ", error.responseText);
			}
		});
	});

	// Handle edit button click
	$(document).on('click', '.edit-btn', function () {
		var id = $(this).data('id');
		var officerId = $(this).data('officerid');
		var divisionId = $(this).data('divisionid');
		var courseId = $(this).data('courseid');
		var trainingYearId = $(this).data('trainingyearid');
		var tutorialId = $(this).data('tutorialid');
		var officiate = $(this).data('officiate');

		$('#seniorInstructorId').val(id);
		$('#ddlSeniorInstructor').val(officerId);
		$('#ddlDivision').val(divisionId);
		$('#ddlCourse').val(courseId);
		$('#ddlTrainingYear').val(trainingYearId);
		$('#ddlTutorial').val(tutorialId);
		$('#chkSeniorInstructorOfficiate').prop('checked', officiate);
		$('#seniorInstructorModalLabel').text('Edit Senior Instructor');
		$('#seniorInstructorModal').modal('show');
	});

	// Handle delete button click
	$(document).on('click', '.delete-btn', function () {
		var id = $(this).data('id');
		var row = $(this).closest('tr');
		if (confirm('Are you sure you want to delete this senior instructor?')) {
			$.ajax({
				url: `/api/deployment/seniorinstructors`,
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
					removeRowFromDataTable('#deploymentSeniorInstructorTable', row);

					loadSeniorInstructors(); // Reload senior instructors
				},
				error: function (error) {
					alert("Error deleting senior instructor: " + error.responseText, 'error');
					console.error("Error deleting senior instructor: ", error.responseText);
				}
			});
		}
	});
});