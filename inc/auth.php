<?php
// inc/auth.php
session_start();

function is_admin_logged_in() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function require_admin() {
    if (!is_admin_logged_in()) {
        header('Location: admin_add_animal.php');
        exit;
    }
}
