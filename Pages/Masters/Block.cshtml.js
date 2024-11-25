$(document).ready(function () {
    // Initialize DataTable
    $('#blockTable').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        responsive: true
    });

    // Load divisions into the select dropdown
    loadDivisions();

    // Load blocks on page load
    loadBlocks();

    // Function to load divisions into the dropdown
    function loadDivisions() {
        loadDropdown('/api/divisions', '#divisionId', {}, 'Id', 'DivisionName');
    }

    // Load blocks into the table
    function loadBlocks() {
        $.ajax({
            url: '/api/blocks',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            // Pass block parameters as query string
            data: {
                Id: null,
                DivisionId: null,
                BlockPrefix: null,
                BlockNumber: null
            },
            success: function (data) {
                var table = $('#blockTable').DataTable();
                table.clear(); // Clear existing data
                data.forEach(function (block, index) {
                    table.row.add([
                        index + 1,
                        block.DivisionName,
                        block.BlockPrefix,
                        block.BlockNumber,
                        block.MesBuildingNumber,
                        block.AccommodationType,
                        block.LivingCapacity,
                        block.NumberOfQuarters,
                        `
                                                <button class="btn btn-warning edit-btn" data-id="${block.Id}" data-divisionId="${block.DivisionId}" data-blockprefix="${block.BlockPrefix}"  data-MesBuildingNumber="${block.MesBuildingNumber}" data-accommodationtype="${block.AccommodationType}" data-livingcapacity="${block.LivingCapacity}" data-numberofquarters="${block.NumberOfQuarters}" data-blocknumber="${block.BlockNumber}"><i class="bi bi-pencil"></i></button>
                                <button class="btn btn-danger delete-btn" data-id="${block.Id}"><i class="bi bi-trash"></i></button>
                                `
                    ]).draw();
                });
            },
            error: function (error) {
                console.error("Error fetching blocks:", error);
            }
        });
    }

    // Show modal for adding a new block
    $('#addBlockBtn').click(function () {
        $('#blockForm')[0].reset();
        $('#blockId').val(''); // Clear the hidden ID field
        $('#blockModalLabel').text('Add Block'); // Set title for adding
        $('#blockModal').modal('show');
    });

    // Handle form submission for adding/editing a block
    $('#blockForm').submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        var id = $('#blockId').val();
        var divisionId = $('#divisionId').val();
        var blockPrefix = $('#blockPrefix').val();
        var accommodationType = $('#accommodationType').val();
        var livingCapacity = $('#livingCapacity').val();
        var numberOfQuarters = $('#numberOfQuarters').val();
        var blockNumber = $('#blockNumber').val();
        var mesBuildingNumber = $('#mesBuildingNumber').val();
        var actionUrl = '/api/blocks';

        $.ajax({
            url: actionUrl,
            type: id ? 'PUT' : 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify({
                Id: id ? (id === '' ? null : id) : null,
                DivisionId: divisionId ? (divisionId === '' ? null : divisionId) : null,
                BlockPrefix: blockPrefix,
                MesBuildingNumber: mesBuildingNumber,
                AccommodationType: accommodationType,
                LivingCapacity: livingCapacity,
                NumberOfQuarters: numberOfQuarters,
                BlockNumber: blockNumber
            }),
            success: function (response) {
                alert(response.message, id ? 'info' : 'success');
                $('#blockModal').modal('hide');
                loadBlocks(); // Reload blocks
            },
            error: function (error) {
                alert("Error saving blocks: " + error.responseText, 'error');
                console.error("Error saving blocks:", error);
            }
        });
    });

    // Handle edit button click
    $(document).on('click', '.edit-btn', function () {
        var id = $(this).data('id');
        var division = $(this).data('divisionid');
        var blockPrefix = $(this).data('blockprefix');
        var accommodationType = $(this).data('accommodationtype');
        var livingCapacity = $(this).data('livingcapacity');
        var numberOfQuarters = $(this).data('numberofquarters');
        var blockNumber = $(this).data('blocknumber');
        var mesBuildingNumber = $(this).data('mesbuildingnumber');

        $('#blockId').val(id);
        $('#divisionId').val(division);
        $('#blockPrefix').val(blockPrefix);
        $('#mesBuildingNumber').val(mesBuildingNumber);
        $('#accommodationType').val(accommodationType);
        $('#livingCapacity').val(livingCapacity);
        $('#numberOfQuarters').val(numberOfQuarters);
        $('#blockNumber').val(blockNumber);
        $('#blockModalLabel').text('Edit Block'); // Set title for editing
        $('#blockModal').modal('show');
    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');
        if (confirm('Are you sure you want to delete this block?')) {
            $.ajax({
                url: `/api/blocks`,
                type: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                },
                data: JSON.stringify({ Id: id }),
                success: function (response) {
                    alert(response.message, 'warning');
                    loadBlocks(); // Reload blocks
                },
                error: function (error) {
                    alert("Error deleting block: " + error.responseText, 'error');
                    console.error("Error deleting block:", error);
                }
            });
        }
    });
});