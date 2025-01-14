<?php
/*
Plugin Name: ITI Mapify Extensions
Description: Extends Mapify functionality, adding customization
Version: 2.0.0
Author: nkohlmeier@iti4dmv.com
*/

// Include Parsedown library
require_once(plugin_dir_path(__FILE__) . 'vendor/Parsedown/Parsedown.php');

// Include existing shortcode functionality
require_once(plugin_dir_path(__FILE__) . 'includes/shortcodes.php');

// Include new location filter functionality
require_once(plugin_dir_path(__FILE__) . 'includes/location-filter.php');

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
        echo '</h2>';

        if ($active_tab == 'shortcodes') {
            $this->display_shortcodes_documentation();
        } elseif ($active_tab == 'location-filter') {
            $this->display_location_filter_settings();
        }

        echo '</div>';
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

    public function enqueue_admin_styles() {
        wp_enqueue_style('iti-mapify-extensions-admin', plugin_dir_url(__FILE__) . 'assets/css/admin-styles.css');
    }
}

// Initialize the plugin
function iti_mapify_extensions_init() {
    new ITIMapifyExtensions();
    new ITIMapifyShortcodes();  // From existing functionality
    new LocationFilter();     // New class for location filtering
}

add_action('plugins_loaded', 'iti_mapify_extensions_init');