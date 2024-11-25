$(document).ready(function () {
    // Event listeners for input validation
    $('.form-control[required], input[type="checkbox"][required], select[required], input[type="radio"][required]').on('input change', function () {
        validateInputElement(this);
    });

    const $ddlRegimentCorp = $('#ddlRegimentCorp');
    const $gorkhaRegimentContainer = $('#gorkhaRegimentContainer');
    const $ddlGorkhaRegiment = $('#ddlGorkhaRegiment');

    // Function to handle the display of the Gorkha Regiment dropdown
    function toggleGorkhaRegiment() {
        const selectedText = $ddlRegimentCorp.find('option:selected').text();

        if (selectedText === 'Gorkha Regiment') {
            $gorkhaRegimentContainer.show(); // Show the Gorkha Regiment dropdown
            $ddlGorkhaRegiment.prop('required', true); // Make required
        } else {
            $gorkhaRegimentContainer.hide(); // Hide the Gorkha Regiment dropdown
            $ddlGorkhaRegiment.prop('required', false); // Remove required
            $ddlGorkhaRegiment.val(''); // Reset value
        }
    }

    // Attach the change event to the dropdown
    $ddlRegimentCorp.on('change', toggleGorkhaRegiment);
});

//Handle form submission for all student data
$('#IndianStudentForm').submit(function (event) {
    event.preventDefault();

    // Gather student information data
    let studentData = {
        PersonalNumber: $('#txtPersonalNumber').val(),
        Rank: $('#ddlRank').val(),
        FullName: $('#txtFullName').val(),
        Decoration: $('#txtDecoration').val(),
        Gender: $('#ddlGender').val(),
        DateOfBirth: $('#dtDateOfBirth').val(),
        DateOfCommission: $('#dtDateOfCommission').val(),
        DateOfSeniority: $('#dtDateOfSeniority').val(),
        LineDirectorate: $('#ddlLineDirectorate').val(),
        MilitaryUnit: $('#ddlMilitaryUnit').val(),
        RegimentCorp: $('#ddlRegimentCorp').val(),
        GorkhaRegiment: $('#ddlGorkhaRegiment').val() || null,
        Terrain: $('#ddlTerrain').val(),
        SpecialForce: $('#ddlSpecialForce').val(),
        RashtriyaRifle: $('#ddlRashtriyaRifle').val(),
        CentralBasePostOffice: $('#ddlCentralBasePostOffice').val(),
        PresentUnit: $('#txtPresentUnit').val(),
        ParentUnit: $('#txtParentUnit').val(),
        PostalAddress: $('#txtPostalAddress').val(),
        ArmyPinCode: $('#txtArmyPinCode').val(),
        BrigadeHeadquarter: $('#txtBrigadeHeadquarter').val(),
        DivisionHeadquarter: $('#txtDivisionHeadquarter').val(),
        CorpsHeadquarter: $('#txtCorpsHeadquarter').val(),
        CommandHeadquarter: $('#txtCommandHeadquarter').val(),
        NameOfIO: $('#txtNameOfIO').val(),
        NameOfRO: $('#txtNameOfRO').val(),
        NameOfSRO: $('#txtNameOfSRO').val(),
        CdaAcNumber: $('#txtCdaAcNumber').val(),
        MedicalCategory: $('#ddlMedicalCategory').val(),
        MobileNumber: $('#txtMobileNumber').val(),
        Attendee: $('#ddlAttendee').val(),
        PartBExamPass: $('input[name="PartBExamPass"]:checked').val() === "true",
        PartDExamPass: $('input[name="PartDExamPass"]:checked').val() === "true",
        DsscExamPass: $('input[name="DsscExamPass"]:checked').val() === "true",
        DstscExamPass: $('input[name="DstscExamPass"]:checked').val() === "true",
        AlmcExamPass: $('input[name="AlmcExamPass"]:checked').val() === "true",
        IscExamPass: $('input[name="IscExamPass"]:checked').val() === "true",
        NextKinName: $('#txtNextKinName').val(),
        Relationship: $('#ddlRelationship').val(),
        ContactNumber: $('#txtContactNumber').val(),
        SpouseName: $('#txtSpouseName').val(),
        SpouseOccupation: $('#txtSpouseOccupation').val(),
        OccupationNature: $('#ddlOccupationNature').val(),
        DatetimeOfArrival: $('#dtDatetimeOfArrival').val()
    };

    console.log(studentData);

    var actionUrl = '/api/IndianStudents';
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