<?php

require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = parse_ini_file('.env');

if (!$dotenv) {
    echo json_encode(['success' => false, 'message' => 'Cannot load .env file']);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $dotenv['EMAIL_USER'];
    $mail->Password = $dotenv['EMAIL_PASS'];
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom($dotenv['EMAIL_USER'], 'Website Form');
    $mail->addAddress($dotenv['EMAIL_TO']);

    $mail->isHTML(true);
    $mail->Subject = 'New Form Submission';
    $mail->Body    = 'Name: ' . ($_POST['name'] ?? '') .
                     '<br>Email: ' . ($_POST['email'] ?? '') .
                     '<br>Message: ' . ($_POST['message'] ?? '');

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Booking sent!']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $mail->ErrorInfo]);
}

?>
