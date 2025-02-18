<?php

if (!defined('ABSPATH')) {
    exit;
}

// Register and enqueue accessibility script and stylesheet
function mpfy_enqueue_accessibility_assets() {
    wp_enqueue_script(
        'mpfy-accessibility',
        plugin_dir_url(__FILE__) . '../assets/js/accessibilityInjection.js',
        array('jquery'),
        '1.0',
        true
    );

    wp_enqueue_style(
        'mpfy-accessibility-style',
        plugin_dir_url(__FILE__) . '../assets/css/accessibilityInjection.css',
        array(),
        '1.0'
    );
}
add_action('wp_enqueue_scripts', 'mpfy_enqueue_accessibility_assets');