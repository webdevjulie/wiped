<?php
header('Content-Type: application/json');

require './mailer/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Log incoming data for debugging
error_log("POST data: " . print_r($_POST, true));

$dotenv = parse_ini_file('.env');

if (!$dotenv) {
    echo json_encode(['success' => false, 'message' => 'Configuration file not found.']);
    exit;
}

try {
    $mail = new PHPMailer(true);

    // SMTP config
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $dotenv['EMAIL_USER'] ?? '';
    $mail->Password = $dotenv['EMAIL_PASS'] ?? '';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    if (empty($mail->Username) || empty($mail->Password)) {
        throw new Exception('Email credentials not configured properly.');
    }

    $userEmail = $_POST['email'] ?? '';
    $adminEmail = $dotenv['EMAIL_TO'] ?? '';
    $firstName = $_POST['firstName'] ?? 'Customer';

    if (!$userEmail || !filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Valid user email is required.');
    }

    // -------------------------------
    // Email to USER (confirmation)
    // -------------------------------
    $mail->setFrom($dotenv['EMAIL_USER'], 'Wiped Cleaning Services');
    $mail->addAddress($userEmail);
    $mail->isHTML(true);
    $mail->Subject = 'Booking Confirmation - Wiped Cleaning Services';

    // Friendly summary for user
    $userBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .detail-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3B82F6; }
            .detail-item { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #1E40AF; }
            .footer { text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1 style='margin: 0;'>Thank You for Your Booking!</h1>
            </div>
            <div class='content'>
                <p>Hi <strong>" . htmlspecialchars($firstName) . "</strong>,</p>
                <p>We've received your booking request and are excited to serve you! Here are your booking details:</p>
                
                <div class='detail-box'>";
    
    $importantFields = [
        'homeType' => 'Home Type',
        'serviceType' => 'Service Type',
        'packageName' => 'Package',
        'serviceDate' => 'Service Date',
        'frequency' => 'Frequency',
        'fullBathrooms' => 'Full Bathrooms',
        'halfBathrooms' => 'Half Bathrooms'
    ];
    
    foreach ($importantFields as $key => $label) {
        if (!empty($_POST[$key])) {
            $value = htmlspecialchars($_POST[$key]);
            $userBody .= "<div class='detail-item'><span class='detail-label'>{$label}:</span> {$value}</div>";
        }
    }
    
    // Add additional services if any
    if (!empty($_POST['additionalServices'])) {
        $userBody .= "<div class='detail-item'><span class='detail-label'>Additional Services:</span> " . htmlspecialchars($_POST['additionalServices']) . "</div>";
    }
    
    // Add payment info
    if (!empty($_POST['paymentMethod'])) {
        $userBody .= "<div class='detail-item'><span class='detail-label'>Payment Method:</span> " . htmlspecialchars($_POST['paymentMethod']) . "</div>";
    }
    
    // Add totals
    if (!empty($_POST['total'])) {
        $total = number_format((float)$_POST['total'], 2);
        $userBody .= "<div class='detail-item'><span class='detail-label'>Total:</span> $" . $total . "</div>";
    }
    
    if (!empty($_POST['recurringTotal'])) {
        $recurringTotal = number_format((float)$_POST['recurringTotal'], 2);
        $userBody .= "<div class='detail-item'><span class='detail-label'>Recurring Total (with discount):</span> $" . $recurringTotal . "</div>";
    }
    
    $userBody .= "
                </div>
                
                <p>We will contact you shortly to confirm your booking and answer any questions you may have.</p>
                <p>Thank you for choosing <strong>Wiped Cleaning Services</strong>!</p>
                
                <div class='footer'>
                    <p>Best regards,<br><strong>Wiped Cleaning Services Team</strong></p>
                    <p style='font-size: 12px; color: #9CA3AF;'>This is an automated confirmation email.</p>
                </div>
            </div>
        </div>
    </body>
    </html>";

    $mail->Body = $userBody;
    $mail->send();

    // -------------------------------
    // Email to ADMIN (full details)
    // -------------------------------
    if ($adminEmail && filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
        $mail->clearAddresses();
        $mail->addAddress($adminEmail);
        $mail->Subject = 'New Booking Received from ' . htmlspecialchars($firstName);

        $adminBody = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .header { background: #1E40AF; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .section { background: #f9fafb; padding: 20px; margin: 10px 0; border-radius: 8px; }
                .section-title { color: #1E40AF; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #3B82F6; padding-bottom: 10px; }
                .detail-grid { display: grid; grid-template-columns: 200px 1fr; gap: 10px; }
                .detail-label { font-weight: bold; color: #4B5563; }
                .detail-value { color: #1F2937; }
                .highlight { background: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1 style='margin: 0;'>🧹 New Booking Received</h1>
                    <p style='margin: 5px 0 0 0;'>Booking from " . htmlspecialchars($firstName . ' ' . ($_POST['lastName'] ?? '')) . "</p>
                </div>
                
                <div class='section'>
                    <div class='section-title'>Contact Information</div>
                    <div class='detail-grid'>
                        <div class='detail-label'>Name:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['firstName'] ?? '') . " " . htmlspecialchars($_POST['lastName'] ?? '') . "</div>
                        
                        <div class='detail-label'>Email:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['email'] ?? '') . "</div>
                        
                        <div class='detail-label'>Phone:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['phone'] ?? '') . "</div>
                        
                        <div class='detail-label'>Emergency Contact:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['emergencyContactName'] ?? 'N/A') . " - " . htmlspecialchars($_POST['emergencyContactPhone'] ?? 'N/A') . "</div>
                        
                        <div class='detail-label'>Preferred Contact:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['preferredContact'] ?? 'Not specified') . "</div>
                    </div>
                </div>
                
                <div class='section'>
                    <div class='section-title'>Service Details</div>
                    <div class='detail-grid'>
                        <div class='detail-label'>Home Type:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['homeType'] ?? 'Not specified') . "</div>
                        
                        <div class='detail-label'>Service Type:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['serviceType'] ?? 'Not specified') . "</div>
                        
                        <div class='detail-label'>Package:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['packageName'] ?? 'Not specified') . "</div>
                        
                        <div class='detail-label'>Full Bathrooms:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['fullBathrooms'] ?? '0') . "</div>
                        
                        <div class='detail-label'>Half Bathrooms:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['halfBathrooms'] ?? '0') . "</div>
                        
                        <div class='detail-label'>Service Date:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['serviceDate'] ?? 'Not specified') . "</div>
                        
                        <div class='detail-label'>Frequency:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['frequency'] ?? 'Not specified') . "</div>
                    </div>
                </div>";
        
        // Additional Services
        if (!empty($_POST['additionalServices'])) {
            $adminBody .= "
                <div class='section'>
                    <div class='section-title'>Additional Services</div>
                    <p>" . htmlspecialchars($_POST['additionalServices']) . "</p>
                </div>";
        }
        
        // Rooms to exclude
        if (!empty($_POST['noCleanRooms'])) {
            $adminBody .= "
                <div class='section'>
                    <div class='section-title'>Rooms to Exclude from Cleaning</div>
                    <p>" . htmlspecialchars($_POST['noCleanRooms']) . "</p>
                </div>";
        }
        
        $adminBody .= "
                <div class='section'>
                    <div class='section-title'>Address</div>
                    <p>";
        
        if (!empty($_POST['unit'])) {
            $adminBody .= "Unit: " . htmlspecialchars($_POST['unit']) . "<br>";
        }
        
        $adminBody .= htmlspecialchars($_POST['address'] ?? '') . "<br>";
        $adminBody .= htmlspecialchars($_POST['city'] ?? '') . ", " . htmlspecialchars($_POST['province'] ?? '') . " " . htmlspecialchars($_POST['zipcode'] ?? '');
        $adminBody .= "</p>";
        
        if (!empty($_POST['addressNote'])) {
            $adminBody .= "<p><strong>Address Note:</strong> " . htmlspecialchars($_POST['addressNote']) . "</p>";
        }
        
        $adminBody .= "</div>";
        
        // Key Information
        if (!empty($_POST['keyInfo'])) {
            $adminBody .= "
                <div class='section'>
                    <div class='section-title'>Key Information</div>
                    <p>" . htmlspecialchars($_POST['keyInfo']) . "</p>
                </div>";
        }
        
        // Notes
        if (!empty($_POST['notes'])) {
            $adminBody .= "
                <div class='section'>
                    <div class='section-title'>Job Notes</div>
                    <p>" . nl2br(htmlspecialchars($_POST['notes'])) . "</p>
                </div>";
        }
        
        // Payment & Pricing
        $adminBody .= "
                <div class='highlight'>
                    <div class='section-title'>Payment & Pricing</div>
                    <div class='detail-grid'>
                        <div class='detail-label'>Payment Method:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['paymentMethod'] ?? 'Not specified') . "</div>
                        
                        <div class='detail-label'>Tip:</div>
                        <div class='detail-value'>" . htmlspecialchars($_POST['tip'] ?? '0') . "%</div>
                        
                        <div class='detail-label'>Total:</div>
                        <div class='detail-value' style='font-size: 20px; font-weight: bold; color: #1E40AF;'>$" . number_format((float)($_POST['total'] ?? 0), 2) . "</div>";
        
        if (!empty($_POST['recurringTotal'])) {
            $adminBody .= "
                        <div class='detail-label'>Recurring Total:</div>
                        <div class='detail-value' style='font-size: 18px; font-weight: bold; color: #059669;'>$" . number_format((float)$_POST['recurringTotal'], 2) . " (with discount)</div>";
        }
        
        $adminBody .= "
                    </div>
                </div>";
        
        // Customer Feedback
        if (!empty($_POST['feedback'])) {
            $adminBody .= "
                <div class='section'>
                    <div class='section-title'>Customer Feedback</div>
                    <p>" . nl2br(htmlspecialchars($_POST['feedback'])) . "</p>
                </div>";
        }
        
        $adminBody .= "
            </div>
        </body>
        </html>";

        $mail->Body = $adminBody;
        $mail->send();
    }

    echo json_encode(['success' => true, 'message' => 'Booking sent successfully!']);

} catch (Exception $e) {
    error_log("Booking error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>