<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require('PHPMailer/src/Exception.php');
require('PHPMailer/src/SMTP.php');
require('PHPMailer/src/PHPMailer.php');

function sendOTP($dt) {

    $mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->SMTPDebug = 0;                      //Enable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                       //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $mail->Username   = 'whatsup202x@gmail.com';                //SMTP username
        $mail->Password   = 'whatsup12345!';                        //SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;          //Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
        $mail->Port       = 587;                                    //TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

        //Recipients
        $mail->setFrom('homeseek111@gmail.com', 'Mailer');                     // Sender of email
        $mail->addAddress($dt->acc_email);                                     // Where the email is sent

        //Content
        $headers = "MIME-Version: 1.0" . "\r\n";
	    $headers .= "Content-type: application/json";
        
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = "Your Homeseek One Time Pin";
        $mail->Body    = "
            <html>
                <head></head>
                    <body>
                        <div style='display: flex; flex-direction: column; justify-content: center;'>
                                <div style='margin: 0 auto; width: 75%;'>
                                    <div style='width: fit-content;
                                        padding: 25px;
                                        border: 0.5px solid lightgray;
                                        border-radius: 20px;
                                        text-align: center;'>
                                            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-0/p206x206/212607900_917670178785988_1738179291056352844_n.png?_nc_cat=107&ccb=1-3&_nc_sid=aee45a&_nc_eui2=AeGad25hjnQUaInnRJy9I0tbsKiRGdItfnewqJEZ0i1-d3kpWV2d1YDnADyMap4Ld4yauKa7gVQWKMcFtGcC8x5Z&_nc_ohc=YVljmk_iWAAAX8QjS9b&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=4aa776bbfd7114c77a28bb03e6af2959&oe=60F08E39'>
                                            <p style='margin-top: -20px; font-weight:normal; font-size:20px;'>
                                                Hi, To start using Homeseek. Please verify your email first. Use your OTP code given below. Thankyou so much.
                                            </p>
                                            <p style='background-color: blue;
                                                color: white;
                                                border-radius: 10px;
                                                padding: 15px;
                                                font-size: 20px';
                                                font-weight: 700;>
                                                    $dt->acc_otp
                                            </p>
                                     </div>
                                </div>
                        </div>
                    </body>
            </html>
        ";
        $mail->AltBody = "Your otp code is $dt->acc_otp";

        $mail->send();
        http_response_code(200);
        return array('success', 'Successfully sent email');
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        http_response_code(403);
        return array('failed', 'Failed to send email');
    }
}

?>

