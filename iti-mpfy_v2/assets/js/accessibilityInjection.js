document.addEventListener('DOMContentLoaded', () => {
	setTimeout(() => {
		/* Accessibility injection */
		console.log('injecting accessibility');

		// Insert submit button
		const mpfySearchWrap = document.querySelector('.mpfy-search-wrap');

		const submitButton = document.createElement('input');
		submitButton.type = 'submit';
		submitButton.value = 'Search';
		submitButton.id = 'mpfy-iti-submit';

		if (!mpfySearchWrap) {
			return;
		}
		mpfySearchWrap.insertAdjacentElement('beforebegin', submitButton);

		// Give search dropdown toggle innerText
		const mpfySearchFieldDropdownToggle = document.querySelector('.mpfy-search-field-dropdown-toggle');
		mpfySearchFieldDropdownToggle.innerText = 'Label';

		// Add title and id to the input
		const mpfySearchInput = document.querySelector('.mpfy-search-input');
		if (!mpfySearchInput) return;
		mpfySearchInput.title = 'Find a Self-Service DMV Kiosk';
		mpfySearchInput.id = 'mpfy-iti-search';

		// Add a label to the search field
		if (mpfySearchInput) {
			const mpfySearchLabel = document.createElement('label');
			mpfySearchLabel.htmlFor = 'mpfy-iti-search';
			mpfySearchLabel.innerText = 'Search for a Self-Service DMV Kiosk';
			mpfySearchInput.insertAdjacentElement('beforebegin', mpfySearchLabel);
		}

		// Give category (tag) filter title and id
		const mpfySearchFilter = document.querySelector('.mpfy-tag-select');
		if (!mpfySearchFilter) return;
		mpfySearchFilter.id = 'mpfy-iti-tag';
		mpfySearchFilter.title = 'Filter by category';

		// Add a label to the category filter
		if (mpfySearchFilter) {
			const mpfyFilterLabel = document.createElement('label');
			mpfyFilterLabel.htmlFor = 'mpfy-iti-tag';
			mpfyFilterLabel.innerText = 'Filter by category';
			mpfySearchFilter.insertAdjacentElement('beforebegin', mpfyFilterLabel);
		}

		// Give the hidden pin links content
		const mpfyPins = document.querySelectorAll('.mpfy-pin');
		mpfyPins.forEach((pin) => {
			pin.innerText = 'Kiosk';
		});

		// Give zoom controls content
		const mpfyZoomIn = document.querySelector('.mpfy-zoom-in');
		if (!mpfyZoomIn) {
			console.log('mpfyZoomIn element not found');
			return;
		}
		mpfyZoomIn.innerText = 'Zoom in';

		const mpfyZoomOut = document.querySelector('.mpfy-zoom-out');
		if (!mpfyZoomOut) {
			console.log('mpfyZoomOut element not found');
			return;
		}
		mpfyZoomOut.innerText = 'Zoom out';

		// Make icon background transparent
		const mpfyTlIcon = document.querySelector('.mpfy-tl-i-icon');
		if (mpfyTlIcon) {
			mpfyTlIcon.style.background = 'transparent';
		} else {
			console.log('mpfyTlIcon element not found'); // Might only work if the option for filter is enabled
		}

		// Add title and id to search radius (hidden)
		const mpfySearchRadius = document.querySelector('[name="mpfy_search_radius_type"]');
		if (!mpfySearchRadius) {
			console.log('mpfySearchRadius element not found');
			return;
		}
		mpfySearchRadius.title = 'Search radius';
		mpfySearchRadius.id = 'mpfy-iti-search-radius';1

		// Add a label to the search radius
		if (mpfySearchRadius) {
			const mpfySearchRadiusLabel = document.createElement('label');
			mpfySearchRadiusLabel.htmlFor = 'mpfy-iti-search-radius';
			mpfySearchRadiusLabel.innerText = 'Search radius';
			mpfySearchRadius.insertAdjacentElement('beforebegin', mpfySearchRadiusLabel);
		}

		// Add a title to the search radius (displayed)
		const mpfySearchRadiusDisplay = document.querySelector('[name="mpfy_search_radius"]');
		if (!mpfySearchRadiusDisplay) {
			console.log('mpfySearchRadiusDisplay element not found');
			return;
		}
		mpfySearchRadiusDisplay.title = 'Search radius';

		/* Form functionality*/

		// Select the map
		const mapCanvas = document.querySelector('#mpfy-canvas-0');
		if (mapCanvas) {
			const formElements = [
				mpfySearchInput,
				document.querySelectorAll('.mpfy-selecter-wrap .selecter')[1],	// Search radius
				submitButton,
			];

			// Loop through and add tabindexes
			formElements.forEach((el, index) => {
				if (el) {
					el.setAttribute('tabindex', index + 1);
					// Add a class to select while we're at it
					el.classList.add('mpfy-iti-form-element');
				}
			});

			// Add tabindex to accordion titles
			const accordionTitles = document.querySelectorAll('.mpfy-mll-l-heading');
			accordionTitles.forEach((title) => {
				title.setAttribute('tabindex', 5);
			})

			// Add tabindex to accordion buttons
			const mpfyAccordionButtons = document.querySelectorAll('.mpfy-mll-l-buttons a');

			mpfyAccordionButtons.forEach((link, index) => {
				link.setAttribute('tabindex', 5);
			});

			const mapDiv = document.querySelector('.mpfy-map-canvas-shell-outer');

			// Handle OOS message
			// Create element, add class, add content
			const oosMessage = document.createElement('div');
			oosMessage.classList = 'oos-message';
			oosMessage.innerHTML = `
				Because of national system maintenance by the American Association of Motor Vehicle Administrators (AAMVA), driver’s license/ID transactions won’t be able to be completed online or at self-service stations 
				
				<!-- IMPORTANT: Edit the content between the strong tags -->
				<strong>from 5 a.m. through 12 p.m. Sunday, April 28.</strong>
					
				Vehicle transactions will still be available.
			`;
			// Attach it to the map container
			const mapDivParent = mapDiv.parentNode;
			mapDivParent.insertBefore(oosMessage, mapDiv);

			// Get the search form input and make it required, preventing a submit when it's blank (displays a populated map)
			const searchFormInput = document.querySelector('.mpfy-search-input');
			searchFormInput.required = true;

			// Display the kiosk list
			const kioskList = document.querySelector('.mpfy-mll');
			kioskList.style.visibility = 'visible';
			kioskList.style.position = 'relative';
			const mapShell = document.querySelector('.mpfy-map-canvas-shell');

			// Need to make sure Tooltips don't pop up 😩
			let toolTips;
			const tooltipTimeout = 500;
			setTimeout(() => {
				toolTips = document.querySelectorAll('.mpfy-tooltip');
				if (!toolTips) return;
				toolTips.forEach(toolTip => {
					// Add a class so we can hide them until search with CSS
					toolTip.classList += ' override-tooltip';
				})
			}, tooltipTimeout);

			// Add an event listener for the submit
			const searchForm = document.querySelector('.mpfy-search-form');

			searchForm.addEventListener('submit', () => {
				// Close the keyboard on mobile with blur
				searchFormInput.blur();
				// Wait for render searched kiosks 
				setTimeout(() => {
					// Gotta get those tooltips back
					toolTips.forEach(toolTip => {
						toolTip.classList.remove('override-tooltip');
					})
				}, 2000);
			});
		}

		// Watch for the popup to pop up
		function onPopupAdded(popup) {
			// Force the focus to the popup
			setTimeout(() => {
				const closeTrigger = document.querySelector('.mpfy-p-close');
				const duplicatePopup = document.querySelectorAll('.mpf-p-popup-holder')[1];
				if (duplicatePopup) {
					duplicatePopup.style.display = 'none';
				}
				popup.tabIndex = 0;
				closeTrigger.tabIndex = 0;
				popup.focus();
			}, 500)
		}
	
		function onPopupRemoved() {
			const kioskList = document.querySelector('.mpfy-mll-list');
			kioskList.tabIndex = 5;
			kioskList.focus();
		}
	
		// Set up a MutationObserver to watch for the popup to be added/removed
		const targetClass = 'mpfy-p-popup-active';
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1 && node.classList.contains(targetClass)) {
						onPopupAdded(node);
					}
				});
	
				mutation.removedNodes.forEach((node) => {
					if (node.nodeType === 1 && node.classList.contains(targetClass)) {
						onPopupRemoved();
					}
				});
			});
		});
	
		// Start observing the entire document for child elements being added
		// Popups are added directly to the end of the body 🙄
		observer.disconnect();
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	
		// Start listening for keyboard events
		document.addEventListener("keydown", function(event) {
	
			if (event.key === "Enter" && document.activeElement.tagName === "A") {
				const link = document.activeElement;
				if (link.href === "#" || link.getAttribute("href") === "#") {
					link.click();
				} else if (link.href) {
					window.location.href = link.href; // Navigate if it’s a real link
				}
				event.preventDefault();
			}
	
			const popupCloseTrigger = document.querySelector('.mpfy-p-close');
			if (event.key === 'Escape' && popupCloseTrigger) {
				popupCloseTrigger.click();
			}
	
			if (event.key === "Enter" && document.activeElement) {
				// Trigger a click on the focused element
				document.activeElement.click();
			}
		});
	}, 200)
});