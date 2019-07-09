export const clearTimeout = () => {
    var id = setTimeout(function() {}, 0);
    while (id >= 0) {
        window.clearTimeout(id); // will do nothing if no timeout with id is present
        id--;
    }
}