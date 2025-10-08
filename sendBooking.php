<?php
header('Content-Type: application/json');

require './mailer/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = parse_ini_file('.env');

try {
    $mail = new PHPMailer(true);

    // SMTP config
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $dotenv['EMAIL_USER'];
    $mail->Password = $dotenv['EMAIL_PASS'];
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $userEmail = $_POST['email'] ?? '';
    $adminEmail = $dotenv['EMAIL_TO'] ?? '';

    if (!$userEmail) throw new Exception('User email is missing.');

    // -------------------------------
    // Email to USER (confirmation)
    // -------------------------------
    $mail->setFrom($dotenv['EMAIL_USER'], 'Website Booking');
    $mail->addAddress($userEmail);
    $mail->isHTML(true);
    $mail->Subject = 'Booking Confirmation';

    // Friendly summary for user
    $userBody = "<h2>Thank you for your booking!</h2>";
    $userBody .= "<p>Hi " . htmlspecialchars($_POST['firstName'] ?? '') . ",</p>";
    $userBody .= "<p>We received your booking. Here are your important details:</p>";
    $userBody .= "<ul>";
    $importantFields = ['homeType', 'serviceType', 'packageName', 'total', 'serviceDate'];
    foreach ($importantFields as $key) {
        if (isset($_POST[$key])) {
            $userBody .= "<li><strong>" . htmlspecialchars($key) . ":</strong> " . htmlspecialchars($_POST[$key]) . "</li>";
        }
    }
    $userBody .= "</ul>";
    $userBody .= "<p>We will contact you shortly. Thank you!</p>";

    $mail->Body = $userBody;
    $mail->send();

    // -------------------------------
    // Email to ADMIN (full details)
    // -------------------------------
    if ($adminEmail) {
        $mail->clearAddresses();
        $mail->addAddress($adminEmail);
        $mail->Subject = 'New Booking Received';

        $adminBody = "<h2>New Booking Details</h2>";
        $adminBody .= "<ul>";
        foreach ($_POST as $key => $value) {
            $adminBody .= "<li><strong>" . htmlspecialchars($key) . ":</strong> " . htmlspecialchars($value) . "</li>";
        }
        $adminBody .= "</ul>";

        $mail->Body = $adminBody;
        $mail->send();
    }

    echo json_encode(['success' => true, 'message' => 'Booking sent successfully!']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
