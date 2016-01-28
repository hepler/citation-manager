/*
 * Constants
 */
var BASE_URL = 'http://localhost:8080/cite/';
var FADE_IN_DELAY = 200;
var FADE_OUT_DELAY = 3700;

/*
 * Entry point, runs on page load.
 */
$(function() {
    $('#cite').on('click', handleCitation);
    $('#reset').on('click', resetSearch);
});

/*
 * Handle button click for getting the citation.
 */
function handleCitation() {
    // Get the article title and author name, then ensure
    // that they are valid.
    var author = $('#author').val();
    var title = $('#article').val();
    var approved = validateFields(author, title);

    if(approved) {
        showLoaderAnimation();
        ajax_getCitation(author, title);
    } else {
        sendNotification('title is required', 'fail');
    }
}

/*
 * Ensures that the fields are filled out properly.
 * author - The author of the article.
 * title - The title of the article.
 * Returns boolean, true if valid.
 */
function validateFields(author, title) {
    // Title is required, author is optional
    var trimmedTitle = title.replace(/ /g,'');
    if(trimmedTitle.length == 0) {
        return false;
    }

    return true;

    // TODO
    // - more validation/sanitization here
}

/*
 * Query the API for the proper citation for this item.
 * author - The author of the article.
 * title - The title of the article.
 */
function ajax_getCitation(author, title) {
    // If they didn't give an author, don't include it in the url.
    var url = author ? author + '/' + title : title;

    // Send off ajax request, expecting JSON response.
    var request = $.ajax({
        url: BASE_URL + url,
        type: 'GET',
        dataType: 'html'
    });

    // Parse the response. If successful, put into the textarea and
    // copy it into to the user's clipboard.
    request.done(function(response) {
        var data = JSON.parse(response);

        if(data['success']) {
            hideLoaderAnimation();

            // Copy the contents of the textarea into the clipboard.
            $('#citation').val(data['citation']);
            $('#citation').select();
            document.execCommand('copy');

            sendNotification('copied to clipboard', 'success');
        } else {
            resetSearch();
            sendNotification('error... try again', 'fail');
        }

    });
}

/*
 * Adds a notification to the notification panel.
 * note - The message text of the notification.
 * type - Success or fail notification (adds as a class to the note).
 */
function sendNotification(note, type) {
    $('#notification div').fadeIn(FADE_IN_DELAY);
    $('#notification').html(
        '<div class=' + type + '>' + note + '</div>'
    );
    // The notification fades out.
    $('#notification div').fadeOut(FADE_OUT_DELAY);
}

/*
 * Resets the popup to allow for a new search.
 */
function resetSearch() {
    // Empty the textareas
    $('#author').val('');
    $('#article').val('');

    // Show the input divs, hide the result div
    hideLoaderAnimation();
    $('#result').hide();
    $('#user-input').fadeIn(FADE_IN_DELAY);

    // Flip the buttons
    $('#reset').hide();
    $('#cite').show();
}

/*
 * Show the loader animation while the ajax request is running.
 */
function showLoaderAnimation() {
    $('#cite').hide();
    $('#reset').show();

    $('#user-input').hide();
    $('#loading').fadeIn(FADE_IN_DELAY);
}

/*
 * Hide the loader animation and display the citation results.
 */
function hideLoaderAnimation() {
    $('#loading').hide();
    $('#result').fadeIn(FADE_IN_DELAY);
}
