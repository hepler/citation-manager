// Run on page load
$(function() {
    $('#cite').on('click', cite);
});

// look for citation of this article
function cite() {
    $('#article').html("hello!");
    $('#article').select();
    document.execCommand('copy');
}
