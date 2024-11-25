$(document).ready(function () {
    //Initialize DataTable
    var table = $('#unitTable').DataTable({
        paging: true,
        searching: true,
        ordering: true
    });


    // Load units on page load
    loadUnits();

    // Load Rankmaster into the table
    function loadUnits() {
        // Get the current page index
        var currentPage = table.page();

        $.ajax({
            url: '/api/units',
            type: 'GET',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            success: function (data) {
                table.clear(); // Clear existing data

                data.forEach(function (unit, index) {
                    table.row.add([
                        index + 1,
                        unit.UnitName,
                        unit.SUSNumber,
                        unit.Address,
                        unit.State,
                        unit.PinCode,
                        unit.Mobile,
                        unit.NRS,
                        unit.Remarks,
                        `<button class="btn btn-warning edit-btn" data-id="${unit.Id}" data-unitname="${unit.UnitName}" data-susnumber="${unit.SUSNumber}" data-address="${unit.Address}" data-state="${unit.State}" data-pincode="${unit.PinCode}" data-mobile="${unit.Mobile}" data-nrs="${unit.NRS}" data-remarks="${unit.Remarks}">
                        <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger delete-btn" data-id="${unit.Id}">
                            <i class="bi bi-trash"></i>
                        </button>`
                    ]);
                });

                // Redraw the table and keep the same page
                table.draw(false).page(currentPage).draw(false);
            },
            error: function (error) {
                console.error("Error fetching ranks:", error);
            }
        });
    }


    // Show modal for adding a new division
    $('#addUnitBtn').click(function () {
        $('#UnitForm')[0].reset();
        $('#UnitId').val('');
        $('#UnitModalLabel').text('Unit Master');
        $('#UnitModal').modal('show');
    });

    //Handle form submission for adding/editing a division


    $('#UnitForm').submit(function (event) {
        event.preventDefault();

        var id = $('#UnitId').val();
        var UnitName = $('#txtunit').val();
        var SUSNO = $('#txtsus').val();
        var Address = $('#txtadd').val();
        var State = $('#txtstate').val();
        var pin = $('#txtpin').val();
        var telepone = $('#txttel').val();
        var nrs = $('#txtnrs').val();
        var remark = $('#txtremark').val();
        var actionUrl = '/api/units';
        var actionType = id ? 'PUT' : 'POST';
        var formData = {
            Id: id ? id : null,
            UnitName: UnitName,
            SUSNumber: SUSNO ? SUSNO : null,
            Address: Address ? Address : null,
            State: State ? State : null,
            PinCode: pin ? pin : null,
            TelNumber: telepone ? telepone : null,
            NRS: nrs ? nrs : null,
            Remarks: remark ? remark : null
        };

        $.ajax({
            url: actionUrl,
            type: actionType,
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify(formData),
            success: function (response) {
                alert(response.message, id ? 'info' : 'success');
                $('#UnitModal').modal('hide');
                loadUnits(); // Reload units list or table
            },
            error: function (error) {
                alert("Error saving Unit: " + error.responseText, 'error');
            }
        });
    });


    //Handle edit button click
    $(document).on('click', '.edit-btn', function () {
        var id = $(this).data('id');
        var unitname = $(this).data('unitname');
        var susnumber = $(this).data('susnumber');
        var address = $(this).data('address');
        var state = $(this).data('state');
        var pincode = $(this).data('pincode');
        var mobile = $(this).data('mobile');
        var nrs = $(this).data('nrs');
        var remarks = $(this).data('remarks');

        $('#UnitId').val(id);
        $('#txtunit').val(unitname);
        $('#txtsus').val(susnumber);
        $('#txtadd').val(address);
        $('#txtstate').val(state);
        $('#txtpin').val(pincode);
        $('#txttel').val(mobile);
        $('#txtnrs').val(nrs);
        $('#txtremark').val(remarks);

        $('#UnitModalLabel').text('Edit Unit');
        $('#UnitModal').modal('show');
    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function () {
        var id = $(this).data('id');

        if (confirm('Are you sure you want to delete this Unit?')) {
            $.ajax({
                url: `/api/units`,
                type: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                },
                data: JSON.stringify({ Id: id }),
                success: function (response) {
                    alert(response.message, 'warning');
                    loadUnits(); // Reload units
                },
                error: function (error) {
                    alert("Error deleting rank: " + error.responseText, 'error');
                }
            });
        }
    });
});