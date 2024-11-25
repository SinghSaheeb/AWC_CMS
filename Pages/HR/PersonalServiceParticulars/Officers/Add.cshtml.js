$(document).ready(function () {

    // Handle form submission
    $('#OfficerForm').submit(function (event) {
        console.info("Form submission started.");
        event.preventDefault();

        // Log start of data gathering
        console.info("Gathering officer data from the form...");
        var officerData = {
            // Basic Details
            Service: $('#ddlService option:selected').text() || null,
            DirectingStaff: $('#ddlStaffRole option:selected').text(),
            PostedTo: $('#ddlPostedTo').val() || null,
            PersonalNo: $('#txtPersonalNumber').val() || null,
            PersonalName: $('#txtName').val() || null,
            Initial: $('#txtInitials').val() || null,
            SubstRankId: $('#ddlSubstantiveRank').val() || null,
            SubsRankDate: $('#dtSubstantiveRankDate').val() || null,
            ActRankId: $('#ddlActingRank').val() || null,
            ActRankDate: $('#dtActingRankDate').val() || null,
            RegimentCorpId: $('#ddlRegimentCorp').val() || null,
            CommissionTypeId: $('#ddlCommissionType').val() || null,
            ReligionId: $('#ddlReligion').val() || null,
            CommissionDate: $('#dtCommissionDate').val() || null,
            DateSen: $('#dtSeniorityDate').val() || null,
            DatefirstComm: $('#dtFirstCommissionDate').val() || null,
            DOB: $('#dtBirthDate').val() || null,
            Authority: $('#txtAuthority').val() || null,
            PlaceBirth: $('#txtPlaceOfBirth').val() || null,
            Nationality: $('#txtNationality').val() || null,
            MotherTounge: $('#txtMotherTongue').val() || null,
            PrevOccu: $('#txtPreviousOccupation').val() || null,
            CDAAcNo: $('#txtCdaAccountNumber').val() || null,
            ICardNo: $('#txtIdentityCardNumber').val() || null,
            IdentMark: $('#txtIdentificationMarks').val() || null,
            MedicalId: $('#ddlMedical').val() || null,
            BloodGroupId: $('#ddlBloodGroup').val() || null,
            DateofPosting: $('#txtPostingDate').val() || null,

            // Home Address Details
            PermanentHouseNo: $('#houseNumber').val() || null,
            PermanentVillage: $('#villageMohalla').val() || null,
            PermanentPO: $('#postOffice').val() || null,
            PermanentTehsil: $('#tehsil').val() || null,
            PermanentDist: $('#district').val() || null,
            PermanentState: $('#ddlState').val() || null,
            PermanentNRS: $('#nearestRailwayStation').val() || null,

            // Account Details
            SBankACNo: $('#txtSingleAccountNumber').val() || null,
            SBankName: $('#txtSingleBankName').val() || null,
            SBankCode: $('#txtSingleBankCode').val() || null,
            SBankAddress: $('#txtSingleBankAddress').val() || null,

            JBankACNo: $('#txtJointAccountNumber').val() || null,
            JBankName: $('#txtJointBankName').val() || null,
            JBankCode: $('#txtJointBankCode').val() || null,
            JBankAddress: $('#txtJointBankAddress').val() || null,

            // Next of Kin Details
            NOKName: $('#txtNOKName').val() || null,
            NOKRelationId: $('#ddlNOKRelation').val() || null,
            NOKAddress: $('#txtNOKAddress').val() || null,
            NOKBankAddress: $('#txtNOKBankAddress').val() || null,

            // Will Execution Details
            WillExecuted: $('input[name="willExec"]:checked').val() || null,
            WillLocation: $('#txtWillLocation').val() || null,

            // Family Details
            MStatus: $('input[name="MStatus"]:checked').val() || null,
            SpouseNationalityBM: $('#txtNationalityOfSpouseBeforeMarriage').val() || null,
            DateofMarriage: $('#txtDateOfMarriage').val() || null,
            PlaceofMarriage: $('#txtPlaceOfMarriage').val() || null,
            Law: $('#txtRitesLaws').val() || null,
            ToWhom: $('#txtToWhom').val() || null,
            SpouseDOB: $('#txtDobOfSpouse').val() || null,
            MAuthority: $('#txtAuthority').val() || null,

            AcademicDetails: [],
            ProfessionalQualificationsDetails: [],
            CourseDetails: [],
            PromotionExaminationDetails: [],
            StaffEmploymentDetails: [],
            DecorationsDetails: [],
            ChildrenDetails: []
        };

        console.info("Gathering table data...");

        gatherTableData(
            '#academicDetailsTable',
            ['Name of School / Collage', 'Examination Year', 'Division / Class', 'ExaminationId'],
            officerData.AcademicDetails
        );
        console.log("Academic details captured:", officerData.AcademicDetails);

        gatherTableData(
            '#technicalQualificationsTable',
            ['Qualification', 'QualificationId', 'Institution', 'Division / Class'],
            officerData.ProfessionalQualificationsDetails
        );
        console.log("Professional qualifications details captured:", officerData.ProfessionalQualificationsDetails);

        gatherTableData(
            '#CourseDetailsTable',
            ['Course Name', 'CourseId', 'From', 'To', 'Grading Obtained', 'Institution'],
            officerData.CourseDetails
        );
        console.log("Course details captured:", officerData.CourseDetails);

        gatherTableData(
            '#PromotionExaminationDetailsTable',
            ['Examination', 'Due Date', 'Date of Passing', 'Whether Obtained Distinction', 'Chances Remaining'],
            officerData.PromotionExaminationDetails
        );
        console.log("Promotion examination details captured:", officerData.PromotionExaminationDetails);

        gatherTableData(
            '#StaffEmploymentTable',
            ['Formation/Unit', 'UnitId', 'Appointment Held', 'Place', 'From Date', 'To Date'],
            officerData.StaffEmploymentDetails
        );
        console.log("Staff employment details captured:", officerData.StaffEmploymentDetails);

        gatherTableData(
            '#DecorationTable',
            ['Decoration / Stars / Medals', 'DecorationId', 'Authority', 'Unit', 'UnitId'],
            officerData.DecorationsDetails
        );
        console.log("Decoration details captured:", officerData.DecorationsDetails);

        gatherTableData(
            '#ChildrenDetailsTable',
            ['Name', 'Gender', 'Date of Birth', 'Place of Birth'],
            officerData.ChildrenDetails
        );
        console.log("Children details captured:", officerData.ChildrenDetails);

        console.info("All form data gathered. Preparing to send AJAX request...");

        $.ajax({
            url: '/api/Officers',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
            },
            data: JSON.stringify(officerData),
            success: function (response) {
                console.info("AJAX request successful. Server response:", response);
                window.location.href = "/HR/PersonalServiceParticulars/Officers/List";
            },
            error: function (error) {
                console.error("Error saving data:", error);
                alert("An error occurred while saving the data. Please try again.");
            }
        });

        console.info("AJAX request sent.");
    });
});

// Function to add a new row to the academic details table
function addAcademicDetailsRow() {
    const inputs = [
        $('#txtSchoolName'),
        $('#txtExaminationYear'),
        $('#ddlAcademicDetailsDivisionClass'),
        $('#hdn_ddlExamination'),
        $('#ddlExamination')
    ];
    console.log(inputs)
    // Validate all input fields and add a row if valid
    if (areInputsValid(inputs)) {
        const newRow = $('<tr>').append(
            createTableCell().addClass('row-number'),
            ...inputs.map(input => createTableCell(input)),
            $('<td>').append(createDeleteButton())
        );

        $('#academicDetailsTable tbody').append(newRow); // Append the new row to the table
        resetInputs(inputs); // Reset input fields
        updateRowNumbers('#academicDetailsTable'); // Update row numbers sequentially
    } else {
        alert('Please fill all the fields correctly.');
    }
}

// Function to add a new row to the technical qualifications table
function addTechnicalQualificationsRow() {
    const inputs = [
        $('#ddlQualification'),
        $('#hdn_ddlQualification'),
        $('#txtInstitution'),
        $('#txtYearOfPassing'),
        $('#ddlTechnicalQualificationsDivisionClass')
    ];

    // Validate all input fields and add a row if valid
    if (areInputsValid(inputs)) {
        const newRow = $('<tr>').append(
            createTableCell().addClass('row-number'),
            ...inputs.map(input => createTableCell(input)),
            $('<td>').append(createDeleteButton())
        );

        $('#technicalQualificationsTable tbody').append(newRow); // Append the new row to the table
        resetInputs(inputs); // Reset input fields
        updateRowNumbers('#technicalQualificationsTable'); // Update row numbers sequentially
    } else {
        alert('Please fill all the fields correctly.');
    }
}

// Function to add a new row to the academic details table
function addCourseDetailsRow() {
    const inputs = [
        $('#ddlCourse'),
        $('#hdn_ddlCourse'),
        $('#txtCourseDetailsfrom'),
        $('#txtCourseDetailsTo'),
        $('#txtGrading'),
        $('#txtCourseDetailsInstitution')
    ];
    console.log(inputs);
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

// Function to add a new row to the academic details table
function addPromotionExaminationDetailsRow() {
    const inputs = [
        $('#txtPromotionExam'),
        $('#txtPromotionduedate'),
        $('#txtPromotionduePassing'),
        $('#ddlPromotiondueWhether'),
        $('#txtPromotionChances')
    ];
    // Validate all input fields and add a row if valid
    if (areInputsValid(inputs)) {
        const newRow = $('<tr>').append(
            createTableCell().addClass('row-number'),
            ...inputs.map(input => createTableCell(input)),
            $('<td>').append(createDeleteButton())
        );

        $('#PromotionExaminationDetailsTable tbody').append(newRow); // Append the new row to the table
        resetInputs(inputs); // Reset input fields
        updateRowNumbers('#PromotionExaminationDetailsTable'); // Update row numbers sequentially
    } else {
        alert('Please fill all the fields correctly.');
    }
}

// Function to add a new row to the technical qualifications table
function addStaffEmployment() {
    const inputs = [
        $('#ddlStaffEmploymentUnit'),
        $('#hdn_ddlStaffEmploymentUnit'),
        $('#txtPlace'),
        $('#txtAppointmentHeld'),
        $('#dtStaffEmploymentFrom'),
        $('#dtStaffEmploymentTo')
    ];

    // Validate all input fields and add a row if valid
    if (areInputsValid(inputs)) {
        const newRow = $('<tr>').append(
            createTableCell().addClass('row-number'),
            ...inputs.map(input => createTableCell(input)),
            $('<td>').append(createDeleteButton())
        );

        $('#StaffEmploymentTable tbody').append(newRow); // Append the new row to the table
        resetInputs(inputs); // Reset input fields
        updateRowNumbers('#StaffEmploymentTable'); // Update row numbers sequentially
    } else {
        alert('Please fill all the fields correctly.');
    }
}

// Function to add a new row to the technical qualifications table
function addDecoration() {
    const inputs = [
        $('#ddlHonor'),
        $('#hdn_ddlHonor'),
        $('#txtDecorationAuthority'),
        $('#ddlDecorationUnit'),
        $('#hdn_ddlDecorationUnit')

    ];

    // Validate all input fields and add a row if valid
    if (areInputsValid(inputs)) {
        const newRow = $('<tr>').append(
            createTableCell().addClass('row-number'),
            ...inputs.map(input => createTableCell(input)),
            $('<td>').append(createDeleteButton())
        );

        $('#DecorationTable tbody').append(newRow); // Append the new row to the table
        resetInputs(inputs); // Reset input fields
        updateRowNumbers('#DecorationTable'); // Update row numbers sequentially
    } else {
        alert('Please fill all the fields correctly.');
    }
}

// Function to add a new row to the technical qualifications table
function addChildrenDetails() {
    const inputs = [
        $('#txtChildName'),
        $('#ddlGender'),
        $('#dtDateOfBirth'),
        $('#txtChildPlaceOfBirth')
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

function toggleWillLocation() {
    if ($('#rdWillNo').is(':checked')) {
        $('#divWillLocation').hide();
        $('#txtWillLocation').removeAttr('required'); // Remove required if "No" is selected
    } else {
        $('#divWillLocation').show();
        $('#txtWillLocation').attr('required', 'required'); // Make required if "Yes" is selected
    }
}

function toggleMaritalStatusSection() {
    if ($('#rdMarried').is(':checked')) {
        $('#divIfMarried').show();
        // Make the "If Married" fields required
        $('#txtNationalityOfSpouseBeforeMarriage, #txtDateOfMarriage, #txtPlaceOfMarriage, #txtRitesLaws, #txtToWhom, #txtDobOfSpouse, #txtAuthority').attr('required', 'required');
    } else {
        $('#divIfMarried').hide();
        // Remove the required attribute when not married
        $('#txtNationalityOfSpouseBeforeMarriage, #txtDateOfMarriage, #txtPlaceOfMarriage, #txtRitesLaws, #txtToWhom, #txtDobOfSpouse, #txtAuthority').removeAttr('required');
    }
}

// Function to handle the display of the Gorkha Regiment dropdown
function toggleGorkhaRegiment() {
    const ddlRegimentCorp = document.getElementById('ddlRegimentCorp');
    const gorkhaRegimentContainer = document.getElementById('gorkhaRegimentContainer');
    const ddlGorkhaRegiment = document.getElementById('ddlGorkhaRegiment');

    const selectedText = ddlRegimentCorp.options[ddlRegimentCorp.selectedIndex].text;

    if (selectedText === 'Gorkha Regiment') {
        gorkhaRegimentContainer.style.display = 'block'; // Show the Gorkha Regiment dropdown
        ddlGorkhaRegiment.required = true; // Make required
    } else {
        gorkhaRegimentContainer.style.display = 'none'; // Hide the Gorkha Regiment dropdown
        ddlGorkhaRegiment.required = false; // Remove required
        ddlGorkhaRegiment.value = ''; // Reset value
    }
}

// Attach the change event to the dropdown
const ddlRegimentCorp = document.getElementById('ddlRegimentCorp');
ddlRegimentCorp.addEventListener('change', toggleGorkhaRegiment);