<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'WPDemo' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '+@0d2x}n^&1{>9(HI>_UVu_fLe^+s/@AI{bfhJTsHv+-+%_g<l$7pFwZL*A?w~08' );
define( 'SECURE_AUTH_KEY',  '`cgd@nV{.^V;ufqW=85q(23Yzev2:>Mo5%[S0cm6)[)kDtvfg/NO &jGtujLIZt9' );
define( 'LOGGED_IN_KEY',    'k!jT W3~/{b?;4`F-/3;hO*<4E|j)Taw@TO_r0:*1Qk@s.3>W#sT%#JHI$kS:7q>' );
define( 'NONCE_KEY',        '[q[ld$#dAbpc9aXLf4S0)6yn=#$;:(n$y ?<%rOCrvzxS(2.KiHT5MN5G&Y8LtS)' );
define( 'AUTH_SALT',        'H=)BuJC3up5y{74_ZB+[ty+ab?bbNc)X{^cnEFBB5zW moHDS2-r%?2TZ;&!$O&6' );
define( 'SECURE_AUTH_SALT', ';(7.-?`UWX yn0FzgW@=3j_B!!Z,:Pb<` $8iM -+GG`&ro9{!yo|^I:]bh<BQiD' );
define( 'LOGGED_IN_SALT',   '(Qcx>.U~K_+BR-ox;b8t3bShC_L.9;jfd/XEr=}/g6#1}!gb,nW;$L+*kyJ<pyTQ' );
define( 'NONCE_SALT',       '2yaJo=L=K 1@/!RPvS48EmjEQM@24z_|,$WLMh+;r2F#,LBu@p[LcMs2aa:@V561' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
