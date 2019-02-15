<?php

$devname = strpos($_SERVER['HTTP_USER_AGENT'], 'Unknown');

$remote_referer_arr = parse_url($_SERVER['HTTP_REFERER']);
$this_file_arr = parse_url($_SERVER['HTTP_HOST']);

if ($remote_referer_arr['host'] != $remote_referer_arr['host']) die;

require_once 'config.php';

$email         	= (isset($_POST['email'])) ? htmlspecialchars(stripslashes($_POST['email']), ENT_QUOTES, "UTF-8") : 'не указан';
$name         = (isset($_POST['name'])) ? htmlspecialchars(stripslashes($_POST['name']), ENT_QUOTES, "UTF-8") : 'не указано';
$number         = (isset($_POST['number'])) ? htmlspecialchars(stripslashes($_POST['number']), ENT_QUOTES, "UTF-8") : 'не указан';
$message 				= (isset($_POST['message'])) ? htmlspecialchars(stripslashes($_POST['message']), ENT_QUOTES, "UTF-8") : '';

$utm_source         = (isset($_POST['utm_source'])) ? htmlspecialchars(stripslashes($_POST['utm_source']), ENT_QUOTES, "UTF-8") : '';
$utm_medium         = (isset($_POST['utm_medium'])) ? htmlspecialchars(stripslashes($_POST['utm_medium']), ENT_QUOTES, "UTF-8") : '';
$utm_campaign       = (isset($_POST['utm_campaign'])) ? htmlspecialchars(stripslashes($_POST['utm_campaign']), ENT_QUOTES, "UTF-8") : '';
$utm_term           = (isset($_POST['utm_term'])) ? htmlspecialchars(stripslashes($_POST['utm_term']), ENT_QUOTES, "UTF-8") : '';
$utm_content        = (isset($_POST['utm_content'])) ? htmlspecialchars(stripslashes($_POST['utm_content']), ENT_QUOTES, "UTF-8") : '';
$utm_keyword        = (isset($_POST['utm_keyword'])) ? htmlspecialchars(stripslashes($_POST['utm_keyword']), ENT_QUOTES, "UTF-8") : '';
$str_perehoda       = (isset($_POST['str_perehoda'])) ? htmlspecialchars(stripslashes($_POST['str_perehoda']), ENT_QUOTES, "UTF-8") : '';



if (isset($_POST['siteurl'])) $_POST['siteurl'] = htmlspecialchars(stripslashes($_POST['siteurl']), ENT_QUOTES, "UTF-8");

$message = nl2br($message);

$text .= '<b>Имя клиента:</b> ' . $name . "<br>" . PHP_EOL;
$text .= '<b>Email клиента:</b> ' . $email . "<br>" . PHP_EOL;
$text .= '<b>Телефон клиента:</b> ' . $number . "<br>" . PHP_EOL;
if (!!$message) {$text .= '<b>Заданный вопрос:</b> ' . $message . "<br><br>" . PHP_EOL;}

$text .= '<b>UTM-метки:</b><br>' . PHP_EOL;
$text .= 'utm_source: ' . $utm_source . "<br>" . PHP_EOL;
$text .= 'utm_medium: ' . $utm_medium . "<br>" . PHP_EOL;
$text .= 'utm_campaign: ' . $utm_campaign . "<br>" . PHP_EOL;
$text .= 'utm_term: ' . $utm_term . "<br>" . PHP_EOL;
$text .= 'utm_content: ' . $utm_content . "<br>" . PHP_EOL;
$text .= 'utm_keyword: ' . $utm_keyword . "<br>" . PHP_EOL;
$text .= 'str_perehoda: ' . $str_perehoda . "<br>" . PHP_EOL;

$out_arr = Array( 'sent'=> 1, 'number' => $number, 'email' => $email, 'message' => $message );
echo json_encode($out_arr);

//PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//for relise server
require 'lib/phpmailer/src/Exception.php';
require 'lib/phpmailer/src/PHPMailer.php';
require 'lib/phpmailer/src/SMTP.php';

$mail = new PHPMailer(false); //defaults to using php "mail()"; the true param means it will throw exceptions on errors, which we need to catch
//Server settings
$mail->SMTPOptions = array(
	'ssl' => array(
		'verify_peer' => false,
		'verify_peer_name' => false,
		'allow_self_signed' => true
	)
);
$mail->SMTPDebug = 2;
$mail->Host = $fromHost;
$mail->Port = $fromPort;
$mail->SMTPSecure = "tls";
$mail->SMTPAuth = true;
$mail->CharSet = "UTF-8";

$mail->Username = $fromEmail;
$mail->Password = $fromPass;
//Recipients
$mail->AddAddress($recipientMail, $recipientName);
$mail->SetFrom('mail@foxystudio.by', "Website Form");
$mail->Subject = $subj;
$mail->MsgHTML($text);


try {
    if (isset($_FILES['images']) && count($_FILES['images']['name']) > 0) {

        for($i=0;$i<count($_FILES["images"]["name"]);$i++) {
            if (is_file($_FILES["images"]["tmp_name"][$i]) && is_uploaded_file($_FILES["images"]["tmp_name"][$i])) {
                $mail->AddAttachment($_FILES["images"]["tmp_name"][$i], $_FILES["images"]["name"][$i]);
            }
        }

    }
    $mail->Send();
} catch (Exception $e) {
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
}

