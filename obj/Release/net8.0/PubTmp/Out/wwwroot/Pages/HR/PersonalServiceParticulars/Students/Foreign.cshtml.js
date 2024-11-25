$(document).ready(function () {

    $('input[name="dsopFund"]').change(function () {
        if ($('#rdMarried').is(':checked')) {
            $('#wifeDetails').show();
            $('#txtWifeName').attr('required', true).addClass('is-invalid');
            $('#dtWifeDob').attr('required', true).addClass('is-invalid');
        } else {
            $('#wifeDetails').hide();
            $('#txtWifeName').removeAttr('required').removeClass('is-invalid');
            $('#dtWifeDob').removeAttr('required').removeClass('is-invalid');
        }
    });

    // Event listeners for input validation
    $('.form-control[required], input[type="checkbox"][required], select[required], input[type="radio"][required]').on('input change', function () {
        validateInputElement(this);
    });
});

//Handle form submission for all student data
$('#ForeignStudentForm').submit(function (event) {
    event.preventDefault();
    // Gather personal information data
    let studentData = {
        personalNumber: $('#txtPersonalNumber').val(),
        countryId: $('#ddlCountry').val(),
        fullName: $('#txtFullName').val(),
        shortName: $('#txtShortName').val(),
        rank: $('#txtRank').val(),
        decoration: $('#txtDecoration').val(),
        dateOfBirth: $('#dtDateOfBirth').val(),
        dateOfCommission: $('#dtDateOfCommission').val(),
        militaryUnitId: $('#ddlMilitaryUnit').val(),
        presentUnit: $('#txtPresentUnit').val(),
        medicalCategory: $('#txtMedicalCategory').val(),
        telephoneNumber: $('#txtTelephoneNumber').val(),
        email: $('#txtEmail').val(),
        roomNumberAWC: $('#txtRoomNumberAWC').val(),
        telephoneNumberAWC: $('#txtTelephoneNumberAWC').val(),
        maritalStatus: $('input[name="dsopFund"]:checked').val(),
        wifeName: $('#txtWifeName').val(),
        wifeDateOfBirth: $('#dtWifeDob').val() || null,
        nextOfKinAddress: $('#txtNextOfKinAddress').val(),
        selfTalent: $('#txtSelfTalent').val(),
        wifeTalent: $('#txtWifeTalent').val(),
        dateTimeOfArrival: $('#dtDatetimeOfArrival').val(),
        courseDetails: [],
        childrenDetails: []
    };

    // Gather course details
    gatherTableData(
        '#CourseDetailsTable',
        ['Course', 'Location'], // Specify the headers you want to extract
        studentData.courseDetails
    );

    // Gather children details
    gatherTableData(
        '#ChildrenDetailsTable',
        ['Child Name', 'Gender', 'Date of Birth'], // Specify the headers you want to extract
        studentData.childrenDetails
    );

    // Now you can process this studentData object
    console.log(studentData); // For testing, you can log the data to console

    var actionUrl = '/api/ForeignStudents';
    var actionType = 'POST';

    $.ajax({
        url: actionUrl,
        type: actionType,
        contentType: 'application/json',
        headers: {
            'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        },
        data: JSON.stringify(studentData),
        success: function (response) {
            alert(response.message, 'success');
        },
        error: function (error) {
            alert("Error saving Foreign Students: " + error.responseText, 'error');
        }
    });
});

// Function to add a new row to the technical qualifications table
function addChildrenDetails() {
    const inputs = [
        $('#txtChildName'),
        $('#ddlGender'),
        $('#dtChildDateOfBirth')
    ];

    // Validate all input fields and add a row if valid
    if (areInputsValid(inputs)) {
        const newRow = $('<tr>').append(
            createTableCell().addClass('row-number'),
            ...inputs.map(input => createTableCell(input)),
            $('<td>').append(createDeleteButton())
        );

        $('#ChildrenDetailsTable tbody').append(newRow); // Append the new row to the table
        resetInputs(inputs); // Reset input fields
        updateRowNumbers('#ChildrenDetailsTable'); // Update row numbers sequentially
    } else {
        alert('Please fill all the fields correctly.');
    }
}

// Function to add a new row to the academic details table
function addCourseDetails() {
    const inputs = [
        $('#txtCourse'),
        $('#txtLocation')
    ];

    // Validate all input fields and add a row if valid
    if (areInputsValid(inputs)) {
        const newRow = $('<tr>').append(
            createTableCell().addClass('row-number'),
            ...inputs.map(input => createTableCell(input)),
            $('<td>').append(createDeleteButton())
        );

        $('#CourseDetailsTable tbody').append(newRow); // Append the new row to the table
        resetInputs(inputs); // Reset input fields
        updateRowNumbers('#CourseDetailsTable'); // Update row numbers sequentially
    } else {
        alert('Please fill all the fields correctly.');
    }
}