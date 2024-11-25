$(document).ready(function () {
    //Initialize DataTable
    var table = $('#rankTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });

    // Load divisions on page load
    loadRanks();

    // Load Rankmaster into the table
    function loadRanks() {
        $.ajax({
            url: '/api/Ranks',
            type: 'GET',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            success: function (data) {
                table.clear(); // Clear existing data

                data.forEach(function (obj, index) {
                    table.row.add([
                        index + 1,
                        obj.RankName,
                        obj.Type,
                        obj.Priority,
                        obj.ServiceName,
                        `<button class="btn btn-warning edit-btn" data-id="${obj.Id}" data-rankname="${obj.RankName}" data-type="${obj.Type}" data-priority="${obj.Priority}"data-service="${obj.Service}">
                                <i class="bi bi-pencil"></i>
                            </button>
                                    <button class="btn btn-danger delete-btn" data-id="${obj.Id}">
                                <i class="bi bi-trash"></i>
                            </button>
                            `
                    ]).draw();
                });
            },
            error: function (error) {
                console.error("Error fetching ranks:", error);
            }
        });
    }


    // Show modal for adding a new division
    $('#addRankBtn').click(function () {
        $('#RankForm')[0].reset();
        $('#RankId').val('');
        $('#RankModalLabel').text('Rank Master');
        $('#RankModal').modal('show');
    });

    // Handle form submission for adding/editing a division
    $('#RankForm').submit(function (event) {
        event.preventDefault();

        var id = $('#RankId').val();
        var rankName = $('#txtrank').val();
        var rankType = $('#ddlRankType').val();
        var priority = $('#Priorty').val();
        var service = $('#ddlArmyType').val();
        var actionUrl = '/api/ranks';

        // Prepare the data object
        var formData = {
            Id: id ? id : null,
            RankName: rankName,
            RankType: rankType,
            Priority: priority,
            Service: service
        };

        $.ajax({
            url: actionUrl,
            type: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify(formData),
            success: function (response) {
                alert(response.message, id ? 'info' : 'success');
                $('#RankModal').modal('hide');
                loadRanks(); // Reload ranks list or table
            },
            error: function (error) {
                alert("Error saving rank: " + error.responseText, 'error');
            }
        });
    });


    // Handle edit button click
    $(document).on('click', '.edit-btn', function () {
        var id = $(this).data('id');
        var rankname = $(this).data('rankname');
        var type = $(this).data('type');
        var priority = $(this).data('priority');
        var service = $(this).data('service');

        $('#RankId').val(id);
        $('#txtrank').val(rankname);
        $('#ddlRankType').val(type);
        $('#Priorty').val(priority);
        $('#ddlArmyType').val(service);
        $('#RankModalLabel').text('Edit Rank');
        $('#RankModal').modal('show');
    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');
        if (confirm('Are you sure you want to delete this rank?')) {
            $.ajax({
                url: `/api/Ranks`,
                type: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                },
                data: JSON.stringify({ Id: id }),
                success: function (response) {
                    alert(response.message, 'warning');
                    loadRanks(); // Reload ranks
                },
                error: function (error) {
                    alert("Error deleting rank: " + error.responseText, 'error');
                }
            });
        }
    });
});