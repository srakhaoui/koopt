package com.harington.cooptit.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String RECRUTER = "ROLE_RECRUTER";

    public static final String COOPTER = "ROLE_COOPTER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    private AuthoritiesConstants() {
    }
}
