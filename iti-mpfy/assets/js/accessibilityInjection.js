document.addEventListener('DOMContentLoaded', () => {
	// console.log('Accessibility injection loading...');
	const mainTimeout = 1000;
	/* Utility functions */

	// Create a label element with attributes
	function createLabelWithAtts(htmlFor, innerText) {
		const label = document.createElement('label');
		label.htmlFor = htmlFor;
		label.innerText = innerText;
		return label;
	}

	// Add id and title to an element
	function addIdAndTitleToElement(query, id, title) {
		element = document.querySelector(query);
		element.id = id;
		element.title = title;
	}

	setTimeout(() => {
		/* Accessibility injection */
		// console.log('Injecting accessibility...');

		// Insert submit button
		const mpfySearchWrap = document.querySelector('.mpfy-search-wrap');

		const submitButton = document.createElement('input');
		submitButton.type = 'submit';
		submitButton.value = 'Search';
		submitButton.id = 'mpfy-iti-submit';

		if (mpfySearchWrap) mpfySearchWrap.insertAdjacentElement('beforebegin', submitButton);

		// Give search dropdown toggle innerText
		const mpfySearchFieldDropdownToggle = document.querySelector('.mpfy-search-field-dropdown-toggle');
		mpfySearchFieldDropdownToggle.innerText = 'Label';

		// Handle search input
		const mpfySearchLabel = createLabelWithAtts(
			'mpfy-iti-search', 
			'Search for a Self-Service DMV Kiosk'
		);
		const mpfySearchInput = addIdAndTitleToElement(
			'.mpfy-search-input',
			'Find a Self-Service DMV Kiosk',
			'mpfy-iti-search'
		);
		if (mpfySearchInput) mpfySearchInput.insertAdjacentElement('beforebegin', mpfySearchLabel);

		// Handle category (tag) filter
		const mpfyFilterLabel = createLabelWithAtts(
			'mpfy-iti-tag',
			'Filter by category'
		);
		const mpfySearchFilter = addIdAndTitleToElement(
			'.mpfy-tag-select',
			'Filter by category',
			'mpfy-iti-tag'
		);
		if (mpfySearchFilter) mpfySearchFilter.insertAdjacentElement('beforebegin', mpfyFilterLabel);			

		// Handle search radius
		const mpfySearchRadiusLabel = createLabelWithAtts(
			'mpfy-iti-search-radius',
			'Search radius'
		);
		const mpfySearchRadius = addIdAndTitleToElement(
			'[name="mpfy_search_radius_type"]',
			'Search radius',
			'mpfy-iti-search-radius'
		);
		if (mpfySearchRadius) mpfySearchRadius.insertAdjacentElement('beforebegin', mpfySearchRadiusLabel);

		// Add a title to the search radius (displayed)
		const mpfySearchRadiusDisplay = document.querySelector('[name="mpfy_search_radius"]');
		if (mpfySearchRadiusDisplay) mpfySearchRadiusDisplay.title = 'Search radius';

		// Give the hidden pin links content
		const mpfyPins = document.querySelectorAll('.mpfy-pin');
		if (mpfyPins) mpfyPins.forEach((pin) => { pin.innerText = 'Kiosk'; });

		// Give find my location tool content
		const mpfyFindMe = document.querySelector('.mpfy-map-current-location-icon');
		if (mpfyFindMe) {
			mpfyFindMe.setAttribute('aria-label', 'Find my location');
		}

		// Give zoom controls content
		const mpfyZoomIn = document.querySelector('.mpfy-zoom-in');
		if (mpfyZoomIn) mpfyZoomIn.innerText = 'Zoom in';

		const mpfyZoomOut = document.querySelector('.mpfy-zoom-out');
		if (mpfyZoomOut) mpfyZoomOut.innerText = 'Zoom out';

		// Make icon background transparent
		const mpfyTlIcon = document.querySelector('.mpfy-tl-i-icon');
		if (mpfyTlIcon) mpfyTlIcon.style.background = 'transparent';

		/* Keyboard Navigation */

		// Define focusable elements in order of desired appearance
		// We're displaying them flex: row-reverse; so we define the shape explicitly
		const focusableElements = [
			document.querySelector('.mpfy-search-input'),
			document.querySelectorAll('.mpfy-search-radius .selecter')[1],
			submitButton,
		].filter(el => el); // Filter out any null elements
		const numberOfFormElements = 3;

		// Query all elements and concatenate them to the focusableElements array
		const accordionHeaders = Array.from(document.querySelectorAll('.mpfy-mll-l-heading'));
		if (accordionHeaders) focusableElements.push(...accordionHeaders);

		// Set tabindex to 0 for focusable elements
		focusableElements.forEach(el => el.setAttribute('tabindex', 0));

		// Set tabindex to 0 for accordion buttons
		const accordionButtons = document.querySelectorAll('.mpfy-mll-l-buttons a');
		if (accordionButtons) accordionButtons.forEach(el => el.setAttribute('tabindex', 0));

		// Set tabindex to 0 for map canvas
		// Need the page to flow to the canvas, then direct to the form input
		const mapCanvas = document.querySelector('#mpfy-map-0');
		if (mapCanvas) mapCanvas.setAttribute('tabindex', 0);

		// Set tabindex to -1 for map pins
		const mapPins = document.querySelectorAll('.leaflet-marker-icon');
		if (mapPins) mapPins.forEach(el => el.setAttribute('tabindex', -1));

		// Function to focus on the first accordion item
		function focusOnFirstAccordionItem() {
			if (focusableElements[numberOfFormElements]) {
				focusableElements[numberOfFormElements].focus();
			}
		}

		// Start listening for keys
		document.addEventListener('keydown', function (e) {
			// console.log('element in focus: ', document.activeElement);
			const activeElement = document.activeElement;
			const currentIndex = focusableElements.indexOf(activeElement);

			const pressingEnter = e.key === 'Enter';
			const pressingTab = e.key === 'Tab' && !e.shiftKey;
			const pressingTabAndShift = e.key === 'Tab' && e.shiftKey;
			const accordionExpanded = document.querySelector('.mpfy-mll-location.active');
			const moreDetailsButton = accordionExpanded ? accordionExpanded.querySelector('.mpfy-mll-l-buttons a[data-mapify-action="openPopup"]') : null;
			const leafletAttribution = document.querySelector('.leaflet-control-attribution a');
			const firstAccordionItem = document.querySelector('.mpfy-mll-list .mpfy-mll-location:not(.mpfy-mll-pagination-hidden):not(.mpfy-mll-filter-hidden) .mpfy-mll-l-heading');
			const focusedOnMapContainer = activeElement === mapCanvas
			const focusedOnAccordion = activeElement === accordionExpanded;
			const focusedOnFormElement = focusableElements.slice(0, numberOfFormElements).includes(activeElement);
			const focusedOnFirstFormElement = document.querySelector('.mpfy-search-input') === activeElement;
			const focusedOnSubmitButton = activeElement === submitButton;
			const focusedOnMap = activeElement === document.querySelector('#mpfy-canvas-0');
			const focusedOnMoreDetails = activeElement === moreDetailsButton;

			// console.log('firstAccordionItem:', firstAccordionItem);

			// mpfy-mll
			const mapifyAccordionContainer = document.querySelector('.mpfy-mll');
			const accordionHidden = mapifyAccordionContainer.style.display === 'none';
			// console.log('accordionHidden:', accordionHidden);

			// Add keyboard controls
			switch (true) {
				case pressingEnter && focusedOnFormElement:
					e.preventDefault();
					if (submitButton) submitButton.click();
					break;
				
				case pressingTab && focusedOnMapContainer:
					e.preventDefault();
					focusableElements[0].focus();
					break;
				
				case pressingTab && focusedOnSubmitButton && !accordionHidden:
					e.preventDefault();
					firstAccordionItem.focus();
					break;
				
				case pressingTab && focusedOnSubmitButton && accordionHidden:
					e.preventDefault();
					// If the accordion is hidden, we want to focus on the
					// Leaflet attribute so tabbing flows back to the page
					leafletAttribution.focus();
					break;

				case pressingTab && focusedOnFormElement:
					e.preventDefault();
					const nextIndex = (currentIndex + 1) % focusableElements.length;
					focusableElements[nextIndex].focus();
					break;

				case pressingTabAndShift && focusedOnFirstFormElement:
					e.preventDefault();
					mapCanvas.focus();
					break;

				case pressingTabAndShift && focusedOnFormElement:
					e.preventDefault();
					const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
					focusableElements[prevIndex].focus();
					break;
				
				case accordionHeaders.includes(activeElement) && pressingEnter:
					e.preventDefault();
					activeElement.click();
					break;

				case pressingTab && focusedOnAccordion:
					e.preventDefault();
					const firstButton = accordionExpanded.querySelector('a');
					if (firstButton) firstButton.focus();
					break;

				case pressingTabAndShift && focusedOnMap:
					e.preventDefault();
					focusableElements[numberOfFormElements - 1].focus();
					break;

				case pressingEnter && focusedOnMoreDetails:
					// Wait for popup
					setTimeout(() => {
						const popup = document.querySelector('.mpfy-p-popup-active');
						if (popup) {
							popup.setAttribute('tabindex', 0);
							popup.focus();

							const exitButton = popup.querySelector('.mpfy-p-close');
							// Add event listener to close the popup
							if (exitButton) {
								document.addEventListener('keydown', function (e) {
									const pressingEscape = e.key === 'Escape';
									const exitKeyboardClicked = document.activeElement === exitButton && e.key === 'Enter';

									if (pressingEscape) {
										exitButton.click();
										focusOnFirstAccordionItem();
									} else if (exitKeyboardClicked) {
										exitButton.click();
										focusOnFirstAccordionItem();
									}
								});
							}
						}
					}, 1200);
					break;

				default:
					break;
			}
		});

	}, mainTimeout)
});