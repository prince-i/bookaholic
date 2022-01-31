<?php
    class Auth{
        protected $globalMethods, $pdo;

        public function __construct(\PDO $pdo){
            $this->pdo = $pdo;
			$this->globalMethods = new GlobalMethods($pdo);
        }

        function encryptPassword($pword): ?string {
            $hashFormat="$2y$10$";
            $saltLength=22;
            $salt=$this->generateSalt($saltLength);
            return crypt($pword, $hashFormat.$salt);
        }

        function generateSalt($len){
            $urs=md5(uniqid(mt_rand(), true));
            $b64String=base64_encode($urs);
            $mb64String=str_replace('+','.', $b64String);
            return substr($mb64String, 0, $len);
        }

        public function generateHeader(){
            $header = [
                "typ" => "JWT",
                "alg" => "HS256",
                "app" => "HomeSeek",
                "dev" => "Kirk"
            ];
            return str_replace("=", "", base64_encode(json_encode($header)));
         }

        public function generatePayload($uc, $ue, $ito){
            $payload = [
				"uc" => $uc,
				"ue" => $ue,
				"ito" => $ito,
				"iby" => "Kirk",
				"ie" => "201810361@gordoncollege.edu.ph",
				"exp" => date("Y-m-d H:i:s")
			];
			return str_replace("=", "", base64_decode(json_encode($payload)));
        }

        protected function generateToken($userCode, $userEmail, $fullName) {
			$header = $this->generateHeader();
			$payload = $this->generatePayload($userCode, $userEmail, $fullName);
			$signature = hash_hmac("sha256", "$header.$payload", base64_encode(SECRET));
			return "$header.$payload." .str_replace("=", "", base64_encode($signature));
		}
        
        public function showToken($data){
            $user_data = []; 
            foreach ($data as $key => $value) {
                array_push($user_data, $value);
            }
            return $this->generateToken($user_data[1], $user_data[2], $user_data[3]);
        }


        public function sendPayload($payload, $remarks, $message, $code) {
            $status = array("remarks"=>$remarks, "message"=>$message);
            http_response_code($code);
            return array(
                "status"=>$status,
                "payload"=>$payload,
                'prepared_by'=>'Kirk',
                "timestamp"=>date_create()
            );
        }

        function accountLogin($dt){
            
            $this->sql= "SELECT * FROM tbl_accounts WHERE acc_email = '$dt->acc_email' LIMIT 1";

            try {
                if ($res = $this->pdo->query($this->sql)->fetchColumn() > 0) {
                    $result=$this->pdo->query($this->sql)->fetchAll();

                    foreach ($result as $rec) { 
                        if($this->accountPasswordCheck($dt->acc_password, $rec['acc_password'])){
                            $payload = $rec;
                            $code = 200; 
                            $msg = "Logged in Successfully"; 
                            $remarks = "success";
                            
                        } else{
                            $payload = "incorrectCredentials"; $code= 200; $msg = "Incorrect Password"; $remarks = "failed";
                        }
                    }
                } else{
                    $payload = "notExist!"; $code = 200; $msg = "User does not exist"; $remarks = "notExist";
                }
            } catch (\PDOException $e) {
                $msg = $e->getMessage(); $remarks = "failed";
            }
            return $this->sendPayload($payload, $remarks, $msg, $code);
        }

        function accountRegister($dt) {
            $encryptedPassword = $this->encryptPassword($dt->acc_password);
            $otp = rand(111111, 999999);

            $data = array(); $code = 0; $msg = ""; $remarks = "";

            $sql="SELECT * FROM tbl_accounts WHERE acc_email='$dt->acc_email' LIMIT 1";
                if($this->pdo->query($sql)->fetchAll()) {
                    $data = "exist!"; $code = 200; $msg = "Email Does Exist!"; $remarks = "existing";
                    return $this->sendPayload($data, $remarks, $msg, $code);
                } else {
                    try {
                        $sqlstr = "INSERT INTO tbl_accounts (acc_email, acc_password, acc_fname, acc_lname, acc_phone, acc_role, acc_otp, acc_createdAt) 
                            VALUES ('$dt->acc_email', '$encryptedPassword', '$dt->acc_fname', '$dt->acc_lname', '$dt->acc_phone', '$dt->acc_role', '$otp', NOW())";
                            
                        if($this->pdo->query($sqlstr)) {
                            $data = $dt->acc_email; $code = 200; $msg = "Successfully retrieved the requested records"; $remarks = "success";
                            $otpData = (object) array("acc_email" => $dt->acc_email, "acc_otp" => $otp);
                            sendOTP($otpData);
                        } else { 
                            $data = null; $code = 400; $msg = "Bad Request"; $remarks = "failed";
                        }
                    } catch (\PDOException $e) {
                        $errmsg = $e->getMessage();
                        $code = 403;
                    }
                }
                return $this->sendPayload($data, $remarks, $msg, $code);
        }

        public function accountChangePassword($dt, $filter_data) {
            $sql="SELECT * FROM tbl_accounts WHERE acc_id='$dt->acc_id' LIMIT 1";

            if($res = $this->pdo->query($sql)->fetchAll()) {
                foreach ($res as $rec) {
                    $existingPassword = $rec['acc_password'];
                }
            }

            $checkPassword =  $this->accountPasswordCheck($dt->old_password, $existingPassword);

            if($checkPassword){
                try {
                    $encryptedPassword = $this->encryptPassword($dt->acc_password);

                    $sqlstr = "UPDATE tbl_accounts SET acc_password = '$encryptedPassword' WHERE $filter_data";
                        
                    if($this->pdo->query($sqlstr)) {
                        $data = 'changed!'; $code = 200; $msg = "Successfully Changed Password"; $remarks = "success";
                    } else { 
                        $data = 'error'; $code = 400; $msg = "Bad Request"; $remarks = "failed";
                    }
                    
                } catch (\PDOException $e) {
                    $errmsg = $e->getMessage();
                    $code = 403;
                }
            }else{
                $data = null; $code = 200; $msg = "Incorrect Old Password"; $remarks = "incorrect";
            }

            return $this->sendPayload($data, $remarks, $msg, $code);
        }

        public function accountVerifyEmail($dt) {

            $this->sql="SELECT * FROM tbl_accounts WHERE acc_id='$dt->acc_id' LIMIT 1";

            try {
                if ($res = $this->pdo->query($this->sql)->fetchColumn()>0) {
                    $result=$this->pdo->query($this->sql)->fetchAll();

                    $data = array(); $code = 0; $msg = ""; $remarks = ""; $token = "";
                    foreach ($result as $rec) { 
                        if($dt->acc_otp == $rec['acc_otp']){
                            $this->sql = "UPDATE tbl_accounts SET acc_verified = 1 WHERE acc_id = '$dt->acc_id'";
                            $sqlstr = $this->pdo->prepare($this->sql);
                            $sqlstr->execute();
                            $res = null; $code = 200; $msg = "Successfully verified email"; $remarks = "success";
                        } else{
                            http_response_code(200);
                            $res = null; $code = 200; $msg = "Incorrect otp"; $remarks = "incorrect";
                        }
                    }
                } 
            } catch (\PDOException $e) {
                $msg = $e->getMessage(); $code = 401; $remarks = "failed";
            }
            
            return $this->sendPayload(base64_encode(json_encode($res)), $remarks, $msg, $code);
        }

        function accountPasswordCheck($pw, $existingpw){
            $hash=crypt($pw, $existingpw);
            if($hash === $existingpw){return true;} else {return false;}
        } 

    } 

?>