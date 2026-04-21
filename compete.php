<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'task';
$user = 'root';
$pass = 'root';

try {
    $pdo = new PDO("mysql:host=$host;port=8889;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["id"])) {
        echo json_encode(["success" => false, "error" => "No ID"]);
        exit;
    }

    $id = $data["id"];

    $stmt = $pdo->prepare("SELECT repeats, completed FROM taskA WHERE id = ?");
    $stmt->execute([$id]);
    $task = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$task) {
        echo json_encode(["success" => false, "error" => "Task not found"]);
        exit;
    }

    if ($task["completed"] >= $task["repeats"]) {
    echo json_encode([
        "success" => false,
        "limit" => true
    ]);
    exit;
}

    $completed = $task["completed"] + 1;

    $stmt = $pdo->prepare("
        UPDATE taskA
        SET completed = ?
        WHERE id = ?
    ");

    $stmt->execute([$completed, $id]);

    echo json_encode([
        "success" => true,
        "completed" => $completed,
         "repeats" => $task["repeats"], 
        "done" => $completed >= $task["repeats"]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
   
}

