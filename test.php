<?php
$host = 'localhost';
$db   = 'task'; // <-- твоя база
$user = 'root';
$pass = 'root';      // <-- пароль, если есть

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Подключение к базе прошло успешно!";
} catch (PDOException $e) {
    echo "Ошибка подключения: " . $e->getMessage();
}