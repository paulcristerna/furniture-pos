<?php
function getConnection() {
	$dbhost="localhost";
	$dbuser="id5210987_paul";
	$dbpass="movil747";
	$dbname="id5210987_lavendimia";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh -> exec("set names utf8");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}
?>

