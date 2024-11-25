$(document).ready(function () {

    // Handle form submission with AJAX

    $('#userApprovalForm').submit(function (event) {
        event.preventDefault();

        var userId = $('#userId').val();
        var remark = $('#Remark').val();

        var actionUrl = '/api/Users';

        $.ajax({
            url: actionUrl,
            type: 'PUT',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify({
                Id: userId,
                IsApproved: false,
                UpdatedBy: null,
                Remark: remark
            }),
            success: function (response) {
                alert(response.message, 'success');
                $('#userApprovalModal').modal('hide');
                loadUsers(); // Reload Users
            },
            error: function (error) {
                console.error("Error:", error);
                alert("Error saving division: " + error.responseText, 'error');
            }
        });
    });


    function formatDateTime(dateTimeString) {
        var date = new Date(dateTimeString);

        // Format date as 'YYYY-MM-DD HH:MM:SS'
        var formattedDate = date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('0' + date.getDate()).slice(-2) + ' ' +
            ('0' + date.getHours()).slice(-2) + ':' +
            ('0' + date.getMinutes()).slice(-2) + ':' +
            ('0' + date.getSeconds()).slice(-2);

        return formattedDate;
    }

    // Load users on page load
    loadUsers();

    // Load users into the table
    function loadUsers() {
        $.ajax({
            url: '/api/users',
            type: 'GET',
            data: JSON.stringify({}),
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            success: function (data) {
                // Clear existing rows in tbody
                $('#usersApprovalTable tbody').empty();

                // Loop through the returned data and create table rows
                $.each(data, function (index, user) {
                    // Create a new row
                    var $row = $('<tr>');

                    $row.append($('<td>').text(index+1));
                    $row.append($('<td>').text(user.PersonalNumber));
                    $row.append($('<td>').text(user.Name));
                    $row.append($('<td>').text(user.Email));
                    $row.append($('<td>').text(user.Mobile));
                    $row.append($('<td>').text(formatDateTime(user.CreatedAt)));
                    // Check if the user is approved
                    if (user.IsApproved) {
                        // Create an Approved badge
                        var $approvedBadge = $('<span>')
                            .addClass('badge bg-success')
                            .html('<i class="bi bi-check-circle me-1"></i> Approved');

                        // Append badge to the action cell
                        var $actionCell = $('<td>').append($approvedBadge);
                        $row.append($actionCell);
                    } else {
                        // Create action buttons inside a btn-group
                        var $btnGroup = $('<div>').addClass('btn-group');

                        var $approveButton = $('<button>')
                            .addClass('btn btn-primary approve-btn')
                            .attr('data-id', user.Id)
                            .attr('title', 'Approve')
                            .on('click', function () {
                                // Handle the approve action
                                var userId = $(this).data('id');
                                console.log('Approved User ID:', userId);

                                var actionUrl = '/api/users';

                                $.ajax({
                                    url: actionUrl,
                                    type: 'PUT',
                                    contentType: 'application/json',
                                    headers: {
                                        'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                                    },
                                    data: JSON.stringify({
                                        Id: userId,
                                        IsApproved: true,
                                        UpdatedBy: null
                                    }),
                                    success: function (response) {
                                        alert(response.message, 'success');
                                        loadUsers(); // Reload Users
                                    },
                                    error: function (error) {
                                        alert("Error saving blocks: " + error.responseText, 'error');
                                        console.error("Error saving blocks:", error);
                                    }
                                });
                            })
                            .append($('<i>').addClass('bi bi-check')); // Bootstrap icon for approve

                        var $rejectButton = $('<button>')
                            .addClass('btn btn-secondary reject-btn')
                            .attr('data-id', user.Id)
                            .attr('data-username', user.Name)
                            .attr('data-email', user.Email)
                            .attr('data-mobile', user.Mobile)
                            .attr('title', 'Reject')
                            .on('click', function () {
                                // Handle the reject action
                                var userId = $(this).data('id');
                                var userName = $(this).data('username');
                                var userEmail = $(this).data('email');
                                var userMobile = $(this).data('mobile');

                                $('#userId').val(userId);
                                $('#lblUsername').text(userName);
                                $('#lblUserMobile').text(userMobile);
                                $('#lblUserEmail').text(userEmail);

                                $('#userApprovalModalLabel').text('User Rejection Remark');
                                $('#userApprovalModal').modal('show');
                            })
                            .append($('<i>').addClass('bi bi-x')); // Bootstrap icon for reject

                        // Append buttons to the button group
                        $btnGroup.append($approveButton).append($rejectButton);

                        // Create a cell for the action buttons
                        var $actionCell = $('<td>').append($btnGroup);
                        $row.append($actionCell);
                    }
                    // Append the row to tbody
                    $('#usersApprovalTable tbody').append($row);
                });

                // Add click event to the master checkbox
                $('#selectAll').on('click', function () {
                    // Check or uncheck all checkboxes
                    var isChecked = $(this).is(':checked');
                    $('.user-checkbox').prop('checked', isChecked);
                });
            },
            error: function (error) {
                console.error("Error fetching users:", error);
            }
        });
    }
});