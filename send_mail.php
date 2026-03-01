<?php
// send_mail.php - responderá JSON para o front-end AJAX
header('Content-Type: application/json; charset=utf-8');

// simples função de limpeza para evitar header injection
function clean($s){
    $s = trim($s);
    $s = strip_tags($s);
    return str_replace(array("\r","\n","%0a","%0d"), '', $s);
}

// Configurações
$to = 'duvidas@raquetesearch.com';
$fromEmail = 'no-reply@raquetesearch.com'; // ideal usar um e-mail do seu domínio
$siteName = 'Raquete Search';

// Ler POST
$name = isset($_POST['name']) ? clean($_POST['name']) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? clean($_POST['subject']) : 'Contato via site';
$level = isset($_POST['level']) ? clean($_POST['level']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$honeypot = isset($_POST['website']) ? trim($_POST['website']) : '';

// Validações básicas
if($honeypot !== ''){
    // Spam detectado (honeypot preenchido)
    http_response_code(200);
    echo json_encode(['ok' => true, 'msg' => 'OK']);
    exit;
}

if(empty($name) || empty($email) || empty($message)){
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Preencha os campos obrigatórios.']);
    exit;
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'E-mail inválido.']);
    exit;
}

// Monta o corpo do email
$body  = "Novo contato pelo site {$siteName}\n\n";
$body .= "Nome: {$name}\n";
$body .= "E-mail: {$email}\n";
$body .= "Assunto: {$subject}\n";
$body .= "Nível: {$level}\n\n";
$body .= "Mensagem:\n{$message}\n\n";
$body .= "----\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "\n";
$body .= "User-Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'N/A') . "\n";

// Cabeçalhos
$headers  = "From: {$siteName} <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Envia
$sent = mail($to, "[Contato] {$subject}", $body, $headers);

if($sent){
    echo json_encode(['ok' => true, 'msg' => 'Mensagem enviada com sucesso.']);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Erro ao enviar a mensagem.']);
}
