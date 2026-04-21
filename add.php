<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$dbname = 'task';
$user = 'root';
$pass = 'root';

try {
    $pdo = new PDO("mysql:host=$host;port=8889;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data["name"] ?? '';
    $count = $data["count"] ?? 0;
    $type = $data["type"] ?? 'a'; // По умолчанию 'a', если не указано
    
    // Валидация значения type
    if (!in_array($type, ['a', 'b', 'c'])) {
        $type = 'a';
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO taskA (name, repeats, completed, type)
        VALUES (?, ?, 0, ?)
    ");

    $stmt->execute([$name, $count, $type]);

    echo json_encode([
        'success' => true,
        'message' => 'Задача добавлена',
        'type' => $type
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>