<?php
/*
Plugin Name: ITI Mapify Extensions
Description: Extends Mapify functionality, adding customization
Version: 2.3.2
Version_note: GitHub & Auto-Updates - Test 2
Author: N.Kohlmeier
*/

// Include Parsedown library
require_once(plugin_dir_path(__FILE__) . 'vendor/Parsedown/Parsedown.php');

// Include existing shortcode functionality
require_once(plugin_dir_path(__FILE__) . 'includes/shortcodes.php');

// Include location filter functionality
require_once(plugin_dir_path(__FILE__) . 'includes/location-filter.php');

// Include accessibility injection
require_once(plugin_dir_path(__FILE__) . 'includes/accessibility-injection.php');

// Include the plugin update checker library
require_once(plugin_dir_path(__FILE__) . 'vendor/plugin-update-checker/plugin-update-checker.php');

// Use the correct namespace for the update checker factory
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$update_checker = PucFactory::buildUpdateChecker(
    'https://github.com/NikKohlmeier/iti-mpfy-extensions',
    __FILE__,
    'iti-mpfy'
);

$update_checker->setBranch('main');

// Main plugin class
class ITIMapifyExtensions {
    private $parsedown;

    public function __construct() {
        $this->parsedown = new Parsedown();
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_styles'));
    }

    public function add_admin_menu() {
        add_menu_page(
            'ITI Mapify Extensions',
            'ITI Mapify Extensions',
            'manage_options',
            'iti-mapify-extensions',
            array($this, 'display_admin_page'),
            'dashicons-location-alt',
            99
        );
    }

    public function display_admin_page() {
        echo '<div class="wrap">';
        echo '<h1>ITI Mapify Extensions</h1>';

        // Add tabs for different sections
        $active_tab = isset($_GET['tab']) ? $_GET['tab'] : 'shortcodes';
        
        echo '<h2 class="nav-tab-wrapper">';
        echo '<a href="?page=iti-mapify-extensions&tab=shortcodes" class="nav-tab ' . ($active_tab == 'shortcodes' ? 'nav-tab-active' : '') . '">Shortcodes</a>';
        echo '<a href="?page=iti-mapify-extensions&tab=location-filter" class="nav-tab ' . ($active_tab == 'location-filter' ? 'nav-tab-active' : '') . '">Location Filter</a>';
        echo '<a href="?page=iti-mapify-extensions&tab=accessibility-injection" class="nav-tab ' . ($active_tab == 'accessibility-injection' ? 'nav-tab-active' : '') . '">Accessibility Injection</a>';
        echo '</h2>';

        echo '<div class="itimpfy-admin-content">';

        if ($active_tab == 'shortcodes') {
            $this->display_shortcodes_documentation();
        } elseif ($active_tab == 'location-filter') {
            $this->display_location_filter_settings();
        } elseif ($active_tab == 'accessibility-injection') {
            $this->display_accessibility_injection_settings();
        }

        echo '</div></div>';
    }

    private function display_shortcodes_documentation() {
        $readme_file = plugin_dir_path(__FILE__) . 'README.md';
        if (file_exists($readme_file)) {
            $readme_content = file_get_contents($readme_file);
            echo $this->parsedown->text($readme_content);
        } else {
            echo '<p>Shortcode documentation not found.</p>';
        }
    }

    private function display_location_filter_settings() {
        echo '<form method="post" action="options.php">';
        settings_fields('iti_mapify_extensions_options');
        do_settings_sections('iti-mapify-extensions');
        submit_button();
        echo '</form>';
    }

    private function display_accessibility_injection_settings() {
        $html = <<<HTML
        <h2>Accessibility Injection Notes</h2>
        <h3>Problem</h3>
        <p>
            Mapify does not include form labels, tags, or tabindex attributes for accessibility in some cases.
            Google and other search engines look for these items and they are caught when performing
            accessibility audits. First, this functionality was added to the site through simple js
            into the WP Admin. But, has been moved here for better visibility and consistency
        </p>
        <h3>Purpose</h3>
        <p>To add:</p>
        <ul>
            <li>
                <h4>Form labels</h4>
                <p>
                    Some of Mapify's form elements don't have labels. We needed to create labels and attach them
                    to the form elements. The form was missing a submit button, so that is added too.
                </p>
            </li>
            <li>
                <h4>Tag content</h4>
                <p>
                    Elements such as the hidden kiosk links didn't have text content, so we loop through all of them
                    and give them  the content 'Kiosk'. Google complained about that one in particular.
                </p>
            </li>
            <li>
                <h4>Tabindex</h4>
                <p>
                    Tabindex and keyboard controls are added. The script looks for the popup to load, then focuses 
                    the user there. Then the user can tab through the popup and hit esc as an alternative way to exit. 
                    The form itself was a little tricky because we're applying some row-reverse flex magic, so we define 
                    what the form's order should look like, then loop through and apply tabindex.
                </p>
            </li>
            <em>NOTE: This feature works best when the accordion below the map is enabled via Mapify settings.</em>
        </ul>
    HTML;
        echo $html;        
    }

    public function enqueue_admin_styles() {
        wp_enqueue_style('iti-mapify-extensions-admin', plugin_dir_url(__FILE__) . 'assets/css/admin-styles.css');
    }
}

// Initialize the plugin
function iti_mapify_extensions_init() {
    new ITIMapifyExtensions();
    new LocationShortcode();  // From existing functionality
    new LocationFilter();     // New class for location filtering
}

add_action('plugins_loaded', 'iti_mapify_extensions_init');