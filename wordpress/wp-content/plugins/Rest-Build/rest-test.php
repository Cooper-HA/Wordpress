<?php
/**
 * Plugin Name:       REST Test
 * Description:       Plugin to interface with rest employee rest service.
 * Version:           0.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'admin_menu', 'RESTTEST_add_REST_menu', 11 );
function RESTTEST_add_REST_menu() {
	add_menu_page(
		'REST',
		'REST',
		'manage_options',
		'rest-list',
		'RESTTEST_render_return'
	);
}

function RESTTEST_render_return() {
	?>
	<div class="wrap" id="RESTTEST-return-admin">
		
		<h1>Actions</h1>
		<!-- <button id="RESTTEST-load-books">Load Books</button> -->
		<button id="RESTTEST-fetch-return">Fetch Return</button>
		<h2>Return</h2>
		<textarea id="RESTTEST-return" cols="125" rows="15"></textarea>
	</div>
	<?php
}

add_action('admin_enqueue_scripts', 'RESTTEST_admin_enqueue_scripts');
function RESTTEST_admin_enqueue_scripts(){
	wp_enqueue_script(
		'RESTTEST-admin-script',
		plugins_url() . '/REST-test/admin_resttest.js',
		array( 'wp-api', 'wp-api-fetch' ),
		'1.0.0',
		true
	);
}
add_action('wp_enqueue_scripts', 'enqueue_auth_script_frontend');
function enqueue_auth_script_frontend() {
    if (!is_user_logged_in()) return;

    wp_enqueue_script(
        'frontendjs',
        plugin_dir_url(__FILE__) . 'resttest.js',
        [],
        null,
        true
    );

    $user_id = get_current_user_id();
    $auth_data = get_transient('external_auth_data_' . $user_id);

    wp_localize_script('frontendjs', 'MyAuthData', array(
        'authData' => $auth_data ? $auth_data : null,
    ));
}

add_action('login_enqueue_scripts', 'enqueue_auth_script_login');
function enqueue_auth_script_login() {
    wp_enqueue_script(
        'frontendjs', 
        plugin_dir_url(__FILE__) . 'resttest.js',
        [],
        null,
        true
    );
}

add_action('wp_logout', function () {
    $user_id = get_current_user_id();
    delete_transient('external_auth_data_' . $user_id);
});

add_action('rest_api_init', function () {
    register_rest_route('rest-test/v1', '/schedule', [
        'methods' => 'GET',
        'callback' => 'myplugin_get_calendar_data',
        'permission_callback' => '__return_true',
    ]);
});

add_filter('rest_prepare_user', function($response, $user, $request) {
    if (!empty($user->roles)) {
        $response->data['roles'] = $user->roles;
    }
    return $response;
}, 10, 3);

function rest_form_block_register_block_type() {
	register_block_type( __DIR__ . '/build/test-block' );

	register_block_type(__DIR__ . '/build/day', [
        'render_callback' => 'render_day_block',
	]);
	register_block_type(__DIR__ . '/build/employee-list', [
        'render_callback' => 'render_employee_list',
	]);

	register_block_type(__DIR__ . '/build/time-off', [
        'render_callback' => 'render_time_off_block',
	]);
    register_block_type(__DIR__ . '/build/schedule', [
        'render_callback' => 'render_schedule_block',
	]);
    register_block_type(__DIR__ . '/build/employee-schedule', [
        'render_callback' => 'render_employee_schedule_block',
	]);
	register_block_type(__DIR__ . '/build/employee-time-off', [
        'render_callback' => 'render_employee_time_off_block',
	]);
}
    
add_action( 'init', 'rest_form_block_register_block_type' );

function render_employee_list($attributes, $content) {
    return '<div id="employee-list-front"></div>';
}
function render_day_block($attributes, $content) {
    return '<div id="day-list-front"></div>';
}
function render_employee_time_off_block($attributes, $content) {
    return '<div id="employee-time-off-front"></div>';
}
function render_time_off_block($attributes, $content) {
    return '<div id="time-off-front"></div>';
}
function render_schedule_block($attributes) {
    return '<div id="schedule-calendar-root"></div>';
}
function render_employee_schedule_block($attributes) {
    return '<div id="employee-schedule-root"></div>';
}

add_action('plugins_loaded', function () {

    add_action('after_setup_theme', function () {
        if (!is_user_logged_in()) return;

        $user = wp_get_current_user();
        $roles_to_hide_bar = ['subscriber', 'employee'];

        if (array_intersect($roles_to_hide_bar, $user->roles)) {
            show_admin_bar(false);
        }
    });

add_action('admin_init', function () {
        if (!is_user_logged_in()) return;

        $user = wp_get_current_user();
        $roles_to_block = ['subscriber', 'employee'];

        if (array_intersect($roles_to_block, $user->roles)) {
            if (!defined('DOING_AJAX') || !DOING_AJAX) {
                wp_redirect(home_url());
                exit;
            }
        }
    });

});



//stack overflow
add_action('user_profile_update_errors', 'my_user_profile_update_errors', 10, 3 );
function my_user_profile_update_errors($errors, $update, $user) {
    $errors->remove('empty_email');
}

// This will remove javascript required validation for email input
// It will also remove the '(required)' text in the label
// Works for new user, user profile and edit user forms
add_action('user_new_form', 'my_user_new_form', 10, 1);
add_action('show_user_profile', 'my_user_new_form', 10, 1);
add_action('edit_user_profile', 'my_user_new_form', 10, 1);
function my_user_new_form($form_type) {
    ?>
    <script type="text/javascript">
        jQuery('#email').closest('tr').removeClass('form-required').find('.description').remove();
        // Uncheck send new user email option by default
        <?php if (isset($form_type) && $form_type === 'add-new-user') : ?>
            jQuery('#send_user_notification').removeAttr('checked');
        <?php endif; ?>
    </script>
    <?php
}


function custom_login_redirect($redirect_to, $request, $user) {
    if (isset($user->roles) && is_array($user->roles)) {
        if (in_array('manager', $user->roles)) {
            return home_url('/managers/');
        } elseif (in_array('employee', $user->roles)) {
            return home_url('/employee/');
        }
    }
    return home_url(); // default fallback
}
add_filter('login_redirect', 'custom_login_redirect', 10, 3);

function restrict_managers_page() {
	if (is_page('managers') || is_page('managers_employee_day')) { // check if it's the "managers" page
		if (!is_user_logged_in()) {
			wp_redirect(wp_login_url()); // not logged in? go to login
			exit;
		}
		
		$current_user = wp_get_current_user();
		if (!in_array('manager', $current_user->roles) || !in_array('administrator', $current_user->roles)) {
			wp_die('You do not have permission to view this page.'); // logged in, but not a manager?
			exit;
		}
	}
}
add_action('template_redirect', 'restrict_managers_page');


add_filter('authenticate', 'myplugin_external_auth', 10, 3);

function myplugin_external_auth($user, $username, $password) {
    if (empty($username) || empty($password)) {
        return $user;
    }

    $login_data = array(
        'username' => $username,
        'password' => $password
    );

    $response = wp_remote_post('http://localhost:5000/api/employee/login', array(
        'method'    => 'POST',
        'body'      => json_encode($login_data),
        'headers'   => array(
            'Content-Type' => 'application/json',
        ),
    ));

	if (is_wp_error($response)) {
        return new WP_Error('external_login_failed', 'Could not connect to backend.');
	}

	$body = json_decode(wp_remote_retrieve_body($response), true);
	$code = wp_remote_retrieve_response_code($response);



    if ($code !== 200) {
        return new WP_Error('invalid_login', 'Invalid login from backend.');
    }

    $wp_user = get_user_by('login', $username);

    if (!$wp_user) {
        $user_id = wp_create_user($username, wp_generate_password());
        if (is_wp_error($user_id)) {
            return new WP_Error('user_create_failed', 'Failed to create WP user.');
		}
		
		$user = new WP_User($user_id);
		$user->set_role('employee'); 

        update_user_meta($user_id, 'employee_id', $body['employeeId'] ?? null);

        $wp_user = get_user_by('id', $user_id);
	}
	if (!empty($body)) {
        set_transient('external_auth_data_' . $wp_user->ID, $body, 60);
    }

    return $wp_user;
}
