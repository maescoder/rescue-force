<?php
// inc/mailer.php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Require PHPMailer classes manually
require __DIR__ . '/../vendor/PHPMailer/src/Exception.php';
require __DIR__ . '/../vendor/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../vendor/PHPMailer/src/SMTP.php';

function sendAdoptionConfirmation($toEmail, $applicantName, $petType) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';         // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                     // Enable SMTP authentication
        
        // ---------- YOUR CREDENTIALS HERE ----------
        $mail->Username   = 'YOUR_GMAIL@gmail.com';   // SMTP username (your gmail)
        $mail->Password   = 'YOUR_APP_PASSWORD';      // SMTP password (app password, NOT regular password)
        // -------------------------------------------

        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
        $mail->Port       = 587;                            // TCP port to connect to

        // Recipients
        $mail->setFrom('no-reply@petrescue.local', 'RescueForce');
        $mail->addAddress($toEmail, $applicantName);     // Add a recipient

        // Content
        $mail->isHTML(true);                             // Set email format to HTML
        $mail->Subject = 'Adoption Request Received - RescueForce';
        $mail->Body    = "
            <h2>Hi {$applicantName},</h2>
            <p>Thank you for submitting an adoption request for a <b>{$petType}</b>!</p>
            <p>We have received your application and our team will review it shortly. We are thrilled that you are considering giving a rescue animal a forever home.</p>
            <br>
            <p>Best regards,</p>
            <p><b>The RescueForce Team</b></p>
        ";
        $mail->AltBody = "Hi {$applicantName},\n\nThank you for submitting an adoption request for a {$petType}!\n\nWe have received your application and our team will review it shortly.\n\nBest regards,\nThe RescueForce Team";

        $mail->send();
        return true;
    } catch (Exception $e) {
        // Log the error in a real app: error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}
