$(document).ready(function () {
    // Convert input text to uppercase
    $('#txtPersonalNumber').on('input', function () {
        $(this).val($(this).val().toUpperCase());
    });

    // Handle form submission
    $('#registrationForm').submit(function (event) {
        event.preventDefault();

        // Get the input values
        var course = $('#ddlCourse').val();
        var personalNumber = $('#txtPersonalNumber').val();
        var name = $('#txtName').val();
        var email = $('#txtEmail').val();
        var mobile = $('#txtMobile').val();
        var password = $('#txtPassword').val();
        var confirmPassword = $('#txtConfirmPassword').val(); // Get confirm password

        // Validate password and confirm password match
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return; // Prevent form submission if passwords don't match
        }

        // Create a data object with all input values
        var formData = {
            CourseId: course,
            PersonalNumber: personalNumber,
            Name: name,
            Email: email,
            Mobile: mobile,
            Password: password
        };

        $.ajax({
            url: '/api/users',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify(formData),
            success: function (response) {
                alert(response.message, 'success');
                window.location.href = "/Login";
            },
            error: function (error) {
                console.error("Error saving data:", error);
                alert("Error: " + error.responseText, 'error');
            }
        });
    });
});