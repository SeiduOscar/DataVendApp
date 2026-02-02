<?php 
$username = "root"; 
$password = "";
$hostname = "localhost";
$dbname = "africanboy_deals";

//connection to the database
$dbhandle = mysqli_connect($hostname, $username, $password, $dbname) 
  or die("Unable to connect to MySQL");
  
?> 