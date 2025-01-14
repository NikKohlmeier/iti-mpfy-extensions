# ITI Mapify Extensions [itimpfy] Plugin
v_2.0

***Current features**: Shortcode Templates, Accessibility Injection, Category Filter*

## Objective
***Shortcode Templates***

Simplify the management and generation of adding/removing/updating Mapify kiosk locations.
Previously, HTML was added in the post description in the rich text editors. This led to several issues:
- Code being 'minified' when saved
- Code sometimes breaking when saved
- Updates to the rich text having unexpected effects on the layout, such as tables
- Diminished readability

***Accessibility Injection***

Improve site readability and navigation for users on assistive technology
- Injects labels (hidden) and submit button for search form
- Improves form navigation with `tabindex`

***Category Filter***

Filter map locations based on category (Location Tag) in order to display county/store-specific locations, while maintaining a single map
- Changes value of hidden filter after a delay
- Adds UI to WP Admin for easier connections

## Code Changes to plugin files
No code changes are required. Simply install the plugin
- .zip upload from the GUI
- in the plugins folder via SFTP

## Shortcode Examples & Explanation

### itimpfy_location_main

#### Purpose
Generates HTML for main description (topmost text-input on map-locations post editor)

#### Shortcode Parameters
- `name` - Name of location
- `address` - Address of location, all one line, comma separated
- `cash` - Doesn't expect any specific values. For ex: `cash="true"` does the same as `cash="foo"`
- `hours` - Accepts hours (renders whatever format is input) separated by semicolons. A new line is made for each hours group between semicolons
- `echeck` - Doesn't expect any specific values. For ex: `echeck="true"` does the same as `echeck="foo"`

*NOTE: `echeck` can be changed to any naming convention to suit your needs*

#### Shortcode Example
`[itimpfy_location_main name="New Location" address="123 Main St." cash hours="Mon - Fri: 5am-4pm; Sat & Sun: Closed;" echeck="true"]`


### itimpfy_location_tooltip

#### Purpose
Generates HTML for tooltip in the map-locations post editor

#### Shortcode Parameters
- `address` - Address of location, all one line
- `cash` - Doesn't expect any specific values. For ex: `cash="true"` does the same as `cash="foo"`

#### Shortcode Example
`[itimpfy_location_tooltip address="123 Main St." cash]`

### itimpfy_location_short_description

#### Purpose
Generates HTML for main description (topmost text-input on map-locations post editor)

#### Shortcode Parameters
- `address` - Address of location, all one line, comma separated
- `hours` - Accepts hours (renders whatever format is input) separated by semicolons. A new line is made for each hours group between semicolons

#### Shortcode Example
`[itimpfy_location_short_description address="123 Main St." hours="Mon - Fri: 5am-4pm; Sat & Sun: Closed;"]`

## Category Filter

### Setup
Locations need to have a `Location Tag` set up
- Add the tag in the WP Admin
  - NOTE: Needs to have a Title, Slug, and Description

    *The Description shows up on the filter list on the form (if visible)*

- Go to the map locations and give set the `Location Tag` on the desired location(s)
- Add a new page where the map will be rendered
  - This will show up in the options in the Category Filter dropdown
- Loop through form filter options with Javascrips to remove all undesired items
  - Fired ONLY on map pages you DON'T want to filter

    *So put the script in the BB non-global settings*

For example:
```javascript
window.addEventListener('DOMContentLoaded', () => {
    const allowedTexts = ['Filter', '24/7', 'Nights/Weekends', 'Cash'];

    setTimeout(() => { // Necessary evil
        // Get the (custom) select elements
        const selectElements = document.querySelectorAll('.selecter-item');
        if(!selectElements) return;
        // Iterate over the options and remove ones that don't match
        selectElements.forEach(option => {
            if (!allowedTexts.includes(option.textContent)) {
                option.remove();
            }
        });
    }, 1000); //Adjust as needed
})
```