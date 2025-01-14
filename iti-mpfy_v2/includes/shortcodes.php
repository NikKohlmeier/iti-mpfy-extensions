<?php
class ITIMapifyShortcodes {
    private $parsedown;

    public function __construct() {
        $this->parsedown = new Parsedown();
        $this->register_shortcodes();
        add_filter('mpfy_map_location_tooltip_text', array($this, 'process_shortcodes_in_tooltip'), 10, 1);
    }

    private function register_shortcodes() {
        add_shortcode('itimpfy_location_main', array($this, 'location_main_shortcode'));
        add_shortcode('itimpfy_location_short_description', array($this, 'location_short_description_shortcode'));
        add_shortcode('itimpfy_location_tooltip', array($this, 'location_tooltip_shortcode'));
    }

    public function location_main_shortcode($atts) {
        $atts = shortcode_atts(array(
            'name' => '',
            'address' => '',
            'cash' => '',
            'hours' => '',
            'echeck' => '',
        ), $atts, 'itimpfy_location_main');

        // Sanitize attributes
        $name = sanitize_text_field($atts['name']);
        $address = esc_html($atts['address']);
        $cash = $atts['cash'] ? true : false;
        $hours = esc_html($atts['hours']);
        $echeck = $atts['echeck'] ? true : false;

        // Create HTML output
        $output = $this->generate_location_main_html($name, $address, $cash, $hours, $echeck);

        return $output;
    }

    public function location_short_description_shortcode($atts) {
        $atts = shortcode_atts(array(
            'address' => '',
            'hours' => '',
        ), $atts, 'itimpfy_location_short_description');

        // Sanitize attributes
        $address = esc_html($atts['address']);
        $hours = esc_html($atts['hours']);

        // Generate output
        $output = $this->generate_short_description_html($address, $hours);

        return $output;
    }

    public function location_tooltip_shortcode($atts) {
        $atts = shortcode_atts(array(
            'address' => '',
            'cash' => '',
        ), $atts, 'itimpfy_location_tooltip');

        // Sanitize attributes
        $address = esc_html($atts['address']);
        $cash = $atts['cash'] ? true : false;

        // Generate output
        $output = $this->generate_tooltip_html($address, $cash,);

        return $output;
    }

    public function process_shortcodes_in_tooltip($text) {
        return do_shortcode($text);
    }

    private function generate_location_main_html($name, $address, $cash, $hours, $echeck) {
            $output = <<<HTML
            <div class="main-container">
                <div class="column-container">
                    <p class="address bold-text">$address</p>
                    <p>Located inside the $name, the self-service kiosk is a fast, easy way to renew your registration and walk away with your tabs!</p>
                    <p>Simply scan your <strong>renewal postcard</strong> or type in your <strong>license plate number</strong>, pay your taxes and fees via 
        HTML;

            if($cash) {
                $output .= '<strong>cash</strong>, ';
            }

            $output .= <<<HTML
                <strong>credit card</strong> or <strong>debit card</strong>, and your registration and license plate decal prints immediately.</p>
                <p>Questions? <a href="/faq">Visit our FAQ Page</a></p>
                <p>Renew. Print. Go!</p>
                </div>
                <div class="kiosk-details-container">
                    <h2 class="column-header bold-text">Payment Options</h2>
                    <ul>
        HTML;

            if($cash) {
                $output .= '<li>Cash</li>';
            }

            $output .= <<<HTML
                        <li>Credit Card</li>
                        <li>Debit Card</li>
                    </ul>
                    <h2 class="column-header bold-text">Hours of Operation</h2>
                    <ul>
        HTML;

            // Display hours table
            $hours_rows = explode(';', $hours);
            foreach ($hours_rows as $hours) {
                $output .= "<li>$hours</li>";
            }

            $output .= <<<HTML
                    </ul>
        HTML;

            if($echeck) {
                $output .= <<<HTML
                    <div class="iti-holidays-container">
                        <h3>Kiosks in E-Check locations will be closed on the following holidays:</h3>
                        <ul>
                            <li>New Year's Day</li>
                            <li>MLK Jr. Day</li>
                            <li>President's Day</li>
                            <li>Memorial Day</li>
                            <li>Juneteenth</li>
                            <li>Independence Day</li>
                            <li>Labor Day</li>
                            <li>Columbus Day</li>
                            <li>Veteran's Day</li>
                            <li>Thanksgiving</li>
                            <li>Christmas Day</li>
                        </ul>
                    </div>
            HTML;
            }

            $output .= <<<HTML
                </div>
            </div>
        HTML;

        return $output;
    }

    private function generate_short_description_html($address, $hours) {
        $output = <<<HTML
        <div class="short-description-address bold-text">$address</div>
        <ul>
    HTML;
    
        // Display hours table
        $hours_rows = explode(';', $hours);
        foreach ($hours_rows as $hours) {
            $output .= "<li>$hours</li>";
        }
    
        $output .= <<<HTML
        </ul>
    HTML;
    
        return $output;
    }

    private function generate_tooltip_html($address, $cash) {
        $output = <<<HTML
        <div class="tooltip-address">
            <p>$address</p>
        </div><br>
        <div>
            <p><strong>PAYMENT OPTIONS</strong></p>
            <p>
    HTML;
    
        if ($cash) {
            $output .= 'Cash, ';
        }
    
        $output .= <<<HTML
            Credit & Debit Cards
            </p>
        </div>
        <div class="tooltip-directions">[directions]</div>
    HTML;
    
        return $output;
    }
}
function iti_mapify_shortcodes_init() {
    new ITIMapifyShortcodes();
}

add_action('plugins_loaded', 'iti_mapify_shortcodes_init');

add_filter('mpfy_map_location_tooltip_text', 'override_mapify_shortcode_processing', 10, 1);

function override_mapify_shortcode_processing($text) {
    // Process shortcodes in the tooltip text
    $text = do_shortcode($text);
    return $text;
}