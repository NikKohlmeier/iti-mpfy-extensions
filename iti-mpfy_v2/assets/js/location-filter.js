window.addEventListener('DOMContentLoaded', () => {
    setTimeout(function() {
        const currentUrl = window.location.href;

        // Check if locationFilterData exists
        if (typeof locationFilterData === 'undefined' || !locationFilterData.locationTagMapSettings) {
            return;
        }

        const locationTagMapSettings = locationFilterData.locationTagMapSettings;

        const selectElement = document.querySelector('select[name="mpfy_tag"]');
        if (!selectElement) {
            return;
        }

        let matchedLocationTag = null;
        for (let locationTag in locationTagMapSettings) {
            if (currentUrl.includes(locationTagMapSettings[locationTag].url)) {
                matchedLocationTag = locationTagMapSettings[locationTag];
                break;
            }
        }


        if (matchedLocationTag) {
            // On locationTag map page, show all locations
            selectElement.value = matchedLocationTag.category_id || '';
        } else {
            // On main page, filter out all specified categories
            const categoriesToFilter = Object.values(locationTagMapSettings).map(locationTag => locationTag.category_id);
            Array.from(selectElement.options).forEach(option => {
                if (categoriesToFilter.includes(option.value)) {
                    option.remove();
                }
            });
        }

        // Trigger change event
        const event = new Event('change');
        selectElement.dispatchEvent(event);

        // Update custom-styled element (if using a custom select plugin)
        const selectedItem = document.querySelector('.selecter-item[data-value="' + selectElement.value + '"]');
        if (selectedItem) {
            const currentlySelected = document.querySelector('.selecter-item.selected');
            if (currentlySelected) {
                currentlySelected.classList.remove('selected');
            }
            selectedItem.classList.add('selected');
            const selecterSelected = document.querySelector('.selecter-selected');
            if (selecterSelected) {
                selecterSelected.textContent = selectedItem.textContent;
            }
        }

    }, 200);  // Reduced timeout to match the second snippet
});