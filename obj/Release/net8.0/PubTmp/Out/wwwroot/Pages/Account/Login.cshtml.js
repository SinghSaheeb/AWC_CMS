$(document).ready(function () {
    // Handle form submission
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        // Define the API endpoint URL for user authentication
        var apiUrl = '/api/users';

        // Get the input values
        var email = $('#txtEmail').val();
        var password = $('#txtPassword').val();

        // Create a data object with all input values
        var dataParameters = {
            Email: email,
            Password: password,
            IsApproved: true
        };

        // Append query parameters for GET requests
        const urlWithParams = appendQueryParameters(apiUrl, dataParameters);

        $.ajax({
            url: urlWithParams,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            success: function (response) {
                // Check if the response is null, empty, or []
                if (!response || (Array.isArray(response) && response.length === 0)) {
                    alert("Your account is awaiting approval from the administration. Please wait.", 'info');
                } else {
                    window.location.href = "/Dashboard";
                }
            },
            error: function (error) {
                console.error("Error data:", error);
                alert("Error: " + error.responseText, 'error');
            }
        });
    });
});