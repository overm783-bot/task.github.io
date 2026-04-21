<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$db   = 'task';
$user = 'root';
$pass = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM taskA ORDER BY id ASC");

    $tasks = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row["done"] = $row["completed"] >= $row["repeats"];
        $tasks[] = $row;
    }

    echo json_encode($tasks, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "Ошибка подключения к БД: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}