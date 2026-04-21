<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'task';
$user = 'root';
$pass = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents("php://input"), true);

    if(!isset($input['id'])) {
        throw new Exception("ID не передан");
    }

    $stmt = $pdo->prepare("DELETE FROM taskA WHERE id = ?");
    $stmt->execute([$input['id']]);

    echo json_encode(['success' => true, 'message' => "Задача $input[id] удалена"]);
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>$e->getMessage()]);
}
?>