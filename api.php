<?php
$host = 'localhost';
$db   = 'task';   // имя твоей базы
$user = 'root';
$pass = 'root';        // или пароль, если есть

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // получаем задачи
    $stmt = $pdo->query("SELECT * FROM taskA");
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($tasks);

} catch (PDOException $e) {
    // всегда отдаём JSON с ошибкой
    echo json_encode(['error' => $e->getMessage()]);
}