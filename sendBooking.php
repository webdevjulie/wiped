<?php
header('Content-Type: application/json'); // force JSON response

require './mailer/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = parse_ini_file('.env');

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $dotenv['EMAIL_USER'];
    $mail->Password = $dotenv['EMAIL_PASS'];
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom($dotenv['EMAIL_USER'], 'Website Booking');
    $mail->addAddress($dotenv['EMAIL_TO']);

    $mail->isHTML(true);
    $mail->Subject = 'New Booking Submission';

    // Build body from POST data
    $body = '';
    foreach($_POST as $key => $value){
        $body .= "<strong>".htmlspecialchars($key).":</strong> " . htmlspecialchars($value) . "<br>";
    }

    $mail->Body = $body;
    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Booking sent!']);
} catch (Exception $e) {
    // Send JSON even on error
    echo json_encode(['success' => false, 'message' => $mail->ErrorInfo]);
}
?>
