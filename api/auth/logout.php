<?php
// logout.php
session_start();
$_SESSION = [];
session_destroy();

exit;
?>