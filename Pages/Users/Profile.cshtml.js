
$(document).ready(function () {

    $('#passwordChangeForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the input values
        var password = $('#currentPassword').val();
        var confirmPassword = $('#newPassword').val();
        var reconfirmPassword = $('#renewPassword').val(); // Get re-entered password

        // Validate that all fields are filled
        if (!password || !confirmPassword || !reconfirmPassword) {
            alert("Please fill in all the fields.");
            return; // Prevent form submission if any field is empty
        }

        // Validate password and confirm password match
        if (password === confirmPassword) {
            alert("Current password cannot be the same as the new password. Please choose a different password.",'warning');
            return; // Prevent form submission if passwords are the same
        }

        if (confirmPassword !== reconfirmPassword) {
            alert("New password and re-entered password do not match. Please try again.", 'warning');
            return; // Prevent form submission if passwords don't match
        }

        // Create a data object with all input values
        var formData = {
            Password: password,
            ConfirmPassword: confirmPassword
        };

        // AJAX call to update the user password
        $.ajax({
            url: '/api/users/update-user-pwd',
            type: 'PUT',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify(formData),
            success: function (response) {
                alert(response.message, 'success');
                $('#passwordChangeForm')[0].reset();// Display success message
                // Optionally, reset the form here if needed: $('#passwordChangeForm')[0].reset();
            },
            error: function (error) {
                console.error("Error saving data:", error);
                alert("Error: " + error.responseText, 'error'); // Display error message
            }
        });
    });
});
