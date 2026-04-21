<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'task';
$user = 'root';
$pass = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if(!isset($_GET['id'])) {
        throw new Exception("ID не передан");
    }

    $stmt = $pdo->prepare("SELECT * FROM taskA WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $task = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$task) {
        throw new Exception("Задача не найдена");
    }

    echo json_encode($task);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error'=>$e->getMessage()]);
}
?>