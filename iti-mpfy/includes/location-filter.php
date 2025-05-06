<?php
class LocationFilter {
    public function __construct() {
        add_action('admin_init', array($this, 'register_settings'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }

    public function register_settings() {
        register_setting('iti_mapify_extensions_options', 'location_tag_map_settings', array($this, 'sanitize_location_tag_map_settings'));

        add_settings_section(
            'location_filter_section',
            'Location Tag Map Settings',
            array($this, 'location_filter_section_callback'),
            'iti-mapify-extensions'
        );

        add_settings_field(
            'location_tag_map_settings',
            'Location Tag Map Settings',
            array($this, 'location_tag_map_settings_callback'),
            'iti-mapify-extensions',
            'location_filter_section'
        );
    }

    public function sanitize_location_tag_map_settings($input) {
        $new_input = array();
        foreach ($input as $key => $value) {
            if (isset($value['url']) && isset($value['category_id'])) {
                $new_input[$key]['url'] = esc_url_raw($value['url']);
                $new_input[$key]['category_id'] = intval($value['category_id']);
            }
        }
        return $new_input;
    }

    public function location_filter_section_callback() {
        echo '<p>Select a page and a location tag from the dropdowns below.</p>';
    }

    public function location_tag_map_settings_callback() {
        global $wpdb;

        // Fetch all pages
        $pages = get_pages();

        // Query for location-tag taxonomy
        $location_tags = $wpdb->get_results(
            "SELECT t.term_id, t.name, tt.description 
             FROM {$wpdb->term_taxonomy} tt 
             JOIN {$wpdb->terms} t ON t.term_id = tt.term_id 
             WHERE tt.taxonomy = 'location-tag'"
        );

        $location_tag_map_settings = get_option('location_tag_map_settings', array());
        ?>
        <div id="location-tag-map-settings">
            <?php
            if (!empty($location_tag_map_settings)) {
                foreach ($location_tag_map_settings as $key => $value) {
                    ?>
                    <div class="location-tag-map-row">
                        <!-- Pages Dropdown -->
                        <select name="location_tag_map_settings[<?php echo $key; ?>][url]">
                            <option value="">Select a page</option>
                            <?php foreach ($pages as $page) { 
                                $selected = $value['url'] == get_permalink($page->ID) ? 'selected' : '';
                            ?>
                                <option value="<?php echo esc_url(get_permalink($page->ID)); ?>" <?php echo $selected; ?>>
                                    <?php echo esc_html($page->post_title); ?>
                                </option>
                            <?php } ?>
                        </select>

                        <!-- Location Tags Dropdown -->
                        <select name="location_tag_map_settings[<?php echo $key; ?>][category_id]">
                            <option value="">Select a location tag</option>
                            <?php foreach ($location_tags as $tag) { 
                                $selected = $value['category_id'] == $tag->term_id ? 'selected' : '';
                            ?>
                                <option value="<?php echo esc_attr($tag->term_id); ?>" <?php echo $selected; ?>>
                                    <?php echo esc_html($tag->description); ?>
                                </option>
                            <?php } ?>
                        </select>

                        <input type="button" class="remove-location-tag" value="Remove" />
                    </div>
                    <?php
                }
            }
            ?>
        </div>
        <input type="button" id="add-location-tag" value="Add Location Tag" />

        <script>
        document.addEventListener('DOMContentLoaded', () => {
            let count = <?php echo count($location_tag_map_settings); ?>;

            const addLocationTagButton = document.getElementById('add-location-tag');
            const locationTagMapSettings = document.getElementById('location-tag-map-settings');

            // Add new row dynamically
            addLocationTagButton.addEventListener('click', function() {
                count++;
                const newRow = document.createElement('div');
                newRow.classList.add('location-tag-map-row');

                newRow.innerHTML = `
                    <select name="location_tag_map_settings[${count}][url]">
                        <option value="">Select a page</option>
                        <?php foreach ($pages as $page) { ?>
                            <option value="<?php echo esc_url(get_permalink($page->ID)); ?>"><?php echo esc_html($page->post_title); ?></option>
                        <?php } ?>
                    </select>

                    <select name="location_tag_map_settings[${count}][category_id]">
                        <option value="">Select a location tag</option>
                        <?php foreach ($location_tags as $tag) { ?>
                            <option value="<?php echo esc_attr($tag->term_id); ?>"><?php echo esc_html($tag->description); ?></option>
                        <?php } ?>
                    </select>

                    <input type="button" class="remove-location-tag" value="Remove" />
                `;

                locationTagMapSettings.appendChild(newRow);
            });

            // Remove row functionality
            locationTagMapSettings.addEventListener('click', function(event) {
                if (event.target && event.target.classList.contains('remove-location-tag')) {
                    event.target.parentElement.remove();
                }
            });
        });
        </script>
        <?php
    }

    public function enqueue_scripts() {
        wp_enqueue_script('iti-mapify-location-filter', plugin_dir_url(__FILE__) . '../assets/js/location-filter.js', array('jquery'), '1.0', true);
        wp_localize_script('iti-mapify-location-filter', 'locationFilterData', array(
            'locationTagMapSettings' => get_option('location_tag_map_settings', array())
        ));
    }
}

new LocationFilter();
