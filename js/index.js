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
    $('#cite').on('click', get_citation);
    $('#reset').on('click', resetSearch);
);

/*
 * Gets the proper citation of this article.
 */
function get_citation() {
    var author = $('#author').val();
    var title = $('#article').val();

    // Send off ajax request, expecting JSON response.
    var request = $.ajax({
        url: BASE_URL + author + '/' + title,
        type: 'GET',
        dataType: 'html'
    });

    // Parse response. If successful, put into the textarea and copy it
    // into to the user's clipboard.
    request.done(function(response) {
        var data = JSON.parse(response);

        if(data['success']) {
            $('#cite').hide();
            $('#reset').show();

            $('#user-input').hide();

            $('#result').fadeIn(FADE_IN_DELAY);
            $('#citation').val(data['citation']);
            $('#citation').select();

            document.execCommand('copy');
            sendNotification('copied to clipboard', 'success');
        } else {
            sendNotification('error... try again', 'fail');
        }

    });
}

/*
 * Adds a notification to the notification panel.
 * note - The message text of the notification.
 * type - Is it a success or fail notification (added as a class to the note).
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
    $('#result').hide();
    $('#user-input').fadeIn(FADE_IN_DELAY);

    // Flip the buttons
    $('#reset').hide();
    $('#cite').show();
}
