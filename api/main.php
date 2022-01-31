<?php
    require_once('./config/Config.php');

    $db = new Connection();
    $pdo = $db->connect();
    $gm = new GlobalMethods($pdo);
    $auth = new Auth($pdo);
	$ct = new CustomMethods($pdo);

    if (isset($_REQUEST['request'])) {
		$req = explode('/', rtrim($_REQUEST['request'], '/'));
		// $req = explode('/', rtrim(base64_decode($_REQUEST['request']), '/'));
	} else {
		$req = array("errorcatcher");
	}
    switch($_SERVER['REQUEST_METHOD']) {
		case 'POST':
			switch ($req[0]) {

                // *************************** ACCOUNT RELATED SIDE ****************************** //
				case 'accountLogin':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($auth->accountLogin($d));
				break;

                case 'accountRegister':
                    $d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($auth->accountRegister($d));
                break;

                case 'accountVerifyEmail':
                	$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($auth->accountVerifyEmail($d));
                break;

                case 'accountUpdatePassword':
                	$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($auth->accountUpdatePassword($d, $req[1]));
                break;

				case 'accountSendOTP':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode(sendOTP($d));
                break;

				case 'resendUserOTP':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode(sendOTP($d));
				break;

				// ***************************** APPLICATION SIDE ********************************* //
				
				case 'pullUserInformation':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->select("tbl_accounts", "acc_id = ".$d));
				break;
				
				// ********************************* USER SIDE ************************************* //

				case 'userPullProperties':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->selectWithFilterOneJoin("tbl_property", "tbl_property.prop_id,
					tbl_property.acc_id, tbl_property.type_id, tbl_property.prop_name, tbl_property.prop_isForRent,
					tbl_property.prop_description, tbl_property.prop_price, tbl_property.prop_address,
					tbl_property.prop_image, tbl_accounts.acc_fname, tbl_accounts.acc_lname, tbl_accounts.acc_phone,
					tbl_type.type_name", "INNER JOIN tbl_accounts ON tbl_property.acc_id = tbl_accounts.acc_id
					INNER JOIN tbl_type ON tbl_property.type_id = tbl_type.type_id",
					"prop_status = 1"));
                break;

				case 'userSearchProperties':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->selectWithFilterOneJoin("tbl_property", "tbl_property.prop_id,
					tbl_property.acc_id, tbl_property.type_id, tbl_property.prop_name, tbl_property.prop_isForRent,
					tbl_property.prop_description, tbl_property.prop_price, tbl_property.prop_address,
					tbl_property.prop_image, tbl_accounts.acc_fname, tbl_accounts.acc_lname, tbl_accounts.acc_phone,
					tbl_type.type_name", "INNER JOIN tbl_accounts ON tbl_property.acc_id = tbl_accounts.acc_id
					INNER JOIN tbl_type ON tbl_property.type_id = tbl_type.type_id",
					"(prop_name LIKE '%$d%' OR prop_description LIKE '%$d%') AND prop_status = 1"));
                break;

				case 'userFilterProperties':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->selectWithFilterOneJoin("tbl_property", "tbl_property.prop_id,
					tbl_property.acc_id, tbl_property.type_id, tbl_property.prop_name, tbl_property.prop_isForRent,
					tbl_property.prop_description, tbl_property.prop_price, tbl_property.prop_address,
					tbl_property.prop_image, tbl_accounts.acc_fname, tbl_accounts.acc_lname, tbl_accounts.acc_phone,
					tbl_type.type_name", "INNER JOIN tbl_accounts ON tbl_property.acc_id = tbl_accounts.acc_id
					INNER JOIN tbl_type ON tbl_property.type_id = tbl_type.type_id",
					"prop_isForRent = '$d' AND prop_status = 1"));
                break;
				
				case 'userSetAppointment':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->insert("tbl_appointment", $d));
                break;

				case 'pullUserAppointments':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->selectWithFilterOneJoin("tbl_appointment", "tbl_appointment.app_id,
					tbl_appointment.app_date, tbl_appointment.app_time, tbl_appointment.app_status,
					tbl_property.prop_name, tbl_property.prop_description, tbl_property.prop_price",
					"INNER JOIN tbl_property ON tbl_property.prop_id = tbl_appointment.prop_id",
					"tbl_property.prop_status = 1 AND 
					(tbl_appointment.app_status = 0 OR tbl_appointment.app_status = 1 OR tbl_appointment.app_status = 3) AND tbl_appointment.acc_id = ".$d));
                break;

				case 'userFilterAppointments':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->selectWithFilterOneJoin("tbl_appointment", "tbl_appointment.app_id,
					tbl_appointment.app_date, tbl_appointment.app_time, tbl_appointment.app_status,
					tbl_property.prop_name, tbl_property.prop_description, tbl_property.prop_price",
					"INNER JOIN tbl_property ON tbl_property.prop_id = tbl_appointment.prop_id",
					"tbl_appointment.app_status = '$d'  AND tbl_appointment.acc_id = ".$req[1]));
                break;

				case 'userCancelAppointment':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->update("tbl_appointment", $d, "app_id = $req[1]"));
				break;

				case 'userSaveProperty':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($ct->userSaveProperty("tbl_saves", $d));
                break;

				case 'userPullSaveProperty':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->selectWithFilterOneJoin("tbl_saves", "tbl_saves.save_id, tbl_property.prop_id,
					tbl_property.acc_id, tbl_property.type_id, tbl_property.prop_name, tbl_property.prop_isForRent,
					tbl_property.prop_description, tbl_property.prop_price, tbl_property.prop_address,
					tbl_property.prop_image, tbl_accounts.acc_fname, tbl_accounts.acc_lname, tbl_accounts.acc_phone"
					, "INNER JOIN tbl_accounts ON tbl_saves.acc_id = tbl_accounts.acc_id INNER JOIN tbl_property
					ON tbl_property.prop_id = tbl_saves.prop_id",
					"tbl_property.prop_status = 1 AND tbl_saves.save_status = 0 AND tbl_saves.acc_id = $d ORDER BY tbl_saves.save_id DESC"));
                break;

				case 'userUnsaveProperty':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->update("tbl_saves", $d, "save_id = $req[1]"));
                break;

				case 'userChangePassword':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($auth->accountChangePassword($d, "acc_id = ".$req[1]));
				break;

				case 'editProfile':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
					echo json_encode($gm->update("tbl_accounts", $d, "acc_id = ".$req[1]));
				break;

				// ******************************** SELLER SIDE *************************************//

				case 'sellerPullPropertyTypes':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->select("tbl_type", null));
                break;

				case 'sellerAddProperty':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->insert("tbl_property", $d));
                break;

				case 'sellerEditProperty':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->update("tbl_property", $d, "prop_id = $req[1]"));
                break;
				
				case 'sellerPullProperties':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->select("tbl_property", "(prop_status = 0 OR prop_status = 1 OR prop_status = 2) AND acc_id = ".$d));
                break;

				case 'sellerPostProperty':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->update("tbl_property", $d, "prop_id = $req[1]"));
                break;

				case 'sellerPullLastPropertyValues':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->select("tbl_property", "prop_id = ".$d));
                break;

				case 'pullSellerAppointments':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->selectWithFilterOneJoin("tbl_appointment", "tbl_appointment.app_id,
					tbl_appointment.app_date, tbl_appointment.app_time, tbl_appointment.app_status,
					tbl_property.prop_name, tbl_property.prop_description, tbl_property.prop_price, tbl_accounts.acc_fname, tbl_accounts.acc_lname, tbl_accounts.acc_phone",
					"INNER JOIN tbl_property ON tbl_property.prop_id = tbl_appointment.prop_id INNER JOIN tbl_accounts ON tbl_appointment.acc_id = tbl_accounts.acc_id ",
					"(tbl_appointment.app_status = 0 OR tbl_appointment.app_status = 1 OR tbl_appointment.app_status = 3) AND tbl_property.acc_id = ".$d));
                break;

				case 'sellerFilterAppointments':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($gm->selectWithFilterOneJoin("tbl_appointment", "tbl_appointment.app_id,
					tbl_appointment.app_date, tbl_appointment.app_time, tbl_appointment.app_status,
					tbl_property.prop_name, tbl_property.prop_description, tbl_property.prop_price",
					"INNER JOIN tbl_property ON tbl_property.prop_id = tbl_appointment.prop_id",
					"tbl_appointment.app_status = '$d'  AND tbl_property.acc_id = ".$req[1]));
                break;

                // ******************************** ADMIN SIDE *************************************//
		
				case 'getApplicationTotalUsers':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($ct->getApplicationTotalUsers("tbl_accounts", "acc_role = ".$d));
                break;

				case 'getApplicationTotalProperties':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($ct->getApplicationTotalProperties("tbl_property", "prop_isForRent = 1 AND prop_status = ".$d));
                break;

				case 'getApplicationTotalProperties':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($ct->getApplicationTotalProperties("tbl_property", "prop_isForRent = 0 AND prop_status = ".$d));
                break;

				case 'getApplicationTotalSales':
					$d = json_decode(base64_decode(file_get_contents("php://input")));
                    echo json_encode($ct->getApplicationTotalSales("tbl_property", "prop_isForRent = 1 AND prop_status = ".$d));
                break;
                // ******************************** REPORTS SIDE ***********************************//

                // ******************************** ADDITONALS SIDE ********************************//

				default:
					http_response_code(403);
					echo "Invalid Route/Endpoint";
				break;
			}

		break;

		default:
			http_response_code(403);
			echo "Please contact the Systems Administrator";
		break;
	}
?>