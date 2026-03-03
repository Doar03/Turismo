<?php
// guardar.php - VERSIÓN FINAL con todo corregido
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=utf-8");

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Configuración  puerto 
$host = 'localhost:3307';
$usuario = 'root';
$password = '';
$basedatos = 'turismo_cruz';

// Conectar (forzamos UTF-8)
$conn = new mysqli($host, $usuario, $password, $basedatos);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión: ' . $conn->connect_error
    ]);
    exit;
}

// FORZAR que la conexión use UTF-8 
$conn->set_charset('utf8mb4');

// Obtener datos del formulario
$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$ciudad = $_POST['ciudad'] ?? '';
$agencia = $_POST['agencia'] ?? '';
$cantidad_personas = isset($_POST['cantidad_personas']) ? (int)$_POST['cantidad_personas'] : 0;
$paquete = $_POST['paquete'] ?? 'No especificado';

// Validar datos requeridos
if (empty($nombre) || empty($email) || empty($ciudad) || empty($agencia) || $cantidad_personas < 1) {
    echo json_encode([
        'success' => false,
        'message' => 'Faltan datos requeridos',
        'recibido' => $_POST
    ]);
    exit;
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email inválido'
    ]);
    exit;
}

// Insertar en la base de datos
$sql = "INSERT INTO reservas (nombre, email, telefono, ciudad, agencia, cantidad_personas, paquete, fecha_registro) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la consulta: ' . $conn->error
    ]);
    exit;
}

$stmt->bind_param("sssssis", $nombre, $email, $telefono, $ciudad, $agencia, $cantidad_personas, $paquete);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => '¡Reserva guardada correctamente!',
        'id' => $conn->insert_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>