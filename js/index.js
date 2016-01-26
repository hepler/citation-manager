// Run on page load
$(function() {
    $('#cite').on('click', get_citation);
    $('#rest').on('click', resetSearch);

    $('#author').val('some guy');
    $('#article').val('great article');
});

// Get the proper citation of this article
function get_citation() {
    var author = $('#author').val();
    var title = $('#article').val();
    var request = $.ajax({
        url: 'http://localhost:8080/cite/' + author + '/' + title,
        type: 'GET',
        dataType: 'json'
    });

    // Put the response into the textarea and copy it to clipboard
    request.done(function(data) {
        console.log("done now!");
        console.log(data);

        $('#user-input').hide();

        $('#citation').val(data[0]['citation']);
        $('#citation').select();

        $('#result').fadeIn(200);

        document.execCommand('copy');
        console.log(data[0]['citation']);

        sendNotification('copied to clipboard');
    });
}

// Add a notification to the notification panel
function sendNotification(note) {
    $('#notification div').fadeIn(200);
    $('#notification').html(
        '<div>' + note + '</div>'
    );
    $('#notification div').fadeOut(3000);
}

// Reset the popup to allow for a new search
function resetSearch() {
    // Empty the textareas
    $('#author').val('');
    $('#article').val('');

    // Show the input divs, hide the result div
    $('#result').hide();
    $('#user-input').fadeIn(200);

}
