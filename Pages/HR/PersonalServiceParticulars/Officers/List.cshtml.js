$(document).ready(function () {
    //Initialize DataTable
    var table = $('#officersTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });

    // Load officers on page load
    loadOfficers();

    // Load officers into the table
    function loadOfficers() {
        $.ajax({
            url: '/api/officers',
            type: 'GET',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            success: function (data) {
                var currentPage = table.page(); // Get the current page index
                table.clear(); // Clear existing data

                if (Array.isArray(data) && data.length > 0) { // Check if data is not empty
                    data.forEach(function (obj, index) {
                        table.row.add([
                            index + 1,
                            obj.PersonalNo,
                            obj.PersonalName,
                            getDateOnly(obj.DOB),
                            obj.Service,
                            obj.PostedTo,
                            obj.DirectingStaff,
                            `<button class="btn btn-warning edit-btn" data-id="${obj.Id}" data-rankname="${obj.RankName}" data-type="${obj.Type}" data-priority="${obj.Priority}"data-service="${obj.Service}">
                                <i class="bi bi-pencil"></i>
                            </button>
                                    <button class="btn btn-danger delete-btn" data-id="${obj.Id}">
                                <i class="bi bi-trash"></i>
                            </button>
                            `
                        ]);
                    });
                    table.draw(false).page(currentPage).draw(false); // Restore current page after reload
                } else {
                    console.warn("Data is not an array or is empty.");
                }
            },
            error: function (error) {
                console.error("Error fetching ranks:", error);
            }
        });
    }

    // Handle delete button click
    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');
        var row = $(this).closest('tr');
        if (confirm('Are you sure you want to delete this officer?')) {
            $.ajax({
                url: `/api/Officers`,
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
                    removeRowFromDataTable('#officersTable', row);

                    loadOfficers(); // Reload senior instructors
                },
                error: function (error) {
                    alert("Error deleting senior instructor: " + error.responseText, 'error');
                    console.error("Error deleting senior instructor: ", error.responseText);
                }
            });
        }
    });
});