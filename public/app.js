/* public/app.js */

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const scheduleItems = document.querySelectorAll('.schedule-item');

    searchBar.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        scheduleItems.forEach(item => {
            if (item.classList.contains('break')) {
                return;
            }

            const categories = item.dataset.category.toLowerCase();
            if (categories.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
