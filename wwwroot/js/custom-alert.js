// Override the window.alert() function
window.alert = function (message, type = 'info') {
    const typeClasses = {
        primary: 'alert-primary bg-primary text-light',
        secondary: 'alert-secondary bg-secondary text-light',
        success: 'alert-success bg-success text-light',
        error: 'alert-danger bg-danger text-light',
        warning: 'alert-warning bg-warning text-dark',
        info: 'alert-primary bg-primary text-light',
        light: 'alert-light bg-light text-dark',
        dark: 'alert-dark bg-dark text-light'
    };

    const textColorClass = typeClasses[type]?.split(' ').find(cls => cls.startsWith('text-')) || 'text-light';

    // Create the custom alert
    const customAlert = $(`
        <div class="custom-alert alert border-0 d-flex align-items-center justify-content-between ${typeClasses[type] || typeClasses.info}">
            <span>${message}</span>
            <button type="button" class="btn-close btn-close-large ${textColorClass}" aria-label="Close"></button>
        </div>
    `).appendTo('body').fadeIn();

    // Apply custom styles for the larger close button
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .btn-close-large {
                width: 1.5rem;
                height: 1.5rem;
                font-size: 1.25rem;
                line-height: 1.5;
            }
        `)
        .appendTo('head');

    // Close the alert when the button is clicked
    customAlert.find('.btn-close').on('click', () => customAlert.fadeOut(() => customAlert.remove()));

    // Auto fade out after 5 seconds
    setTimeout(() => customAlert.fadeOut(() => customAlert.remove()), 5000);
};