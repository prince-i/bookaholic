<?php
	class CustomMethods {
		protected $pdo;

		public function __construct(\PDO $pdo) {
			$this->pdo = $pdo;
		}

        public function userSaveProperty($table, $data) { // It has validation to check first if the event is already saved.
            $sql="SELECT * FROM $table WHERE prop_id='$data->prop_id' AND acc_id='$data->acc_id' LIMIT 1";
            if($this->pdo->query($sql)->fetchAll()) {
                $data = "exist!"; $code = 200; $msg = "Event Already Saved!"; $remarks = "existing";
                return $this->sendPayload($data, $remarks, $msg, $code);
            }else{
                $fields = []; $values = [];
                foreach ($data as $key => $value) {
                    array_push($fields, $key);
                    array_push($values, $value);
                }
                try {
                    $ctr = 0;
                    $sqlstr = "INSERT INTO $table (";
                    foreach ($fields as $field) {
                        $sqlstr .= $field;
                        $ctr++;
                        if($ctr < count($fields)) {
                            $sqlstr .= ", ";
                        }
                    }

                    $sqlstr .= ") VALUES (".str_repeat("?, ", count($values)-1)."?)";

                    $sql = $this->pdo->prepare($sqlstr);
                    $sql->execute($values);
                    return array("code"=>200, "remarks"=>"success");

                } catch(\PDOException $e) {
                    $errmsg = $e->getMessage(); $code = 403;
                }
                return array("code" => $code, "errmsg" => $errmsg);
            }
		}

        public function getApplicationTotalUsers($table, $filter_data){
            $sql = "SELECT COUNT(acc_id) FROM $table ";
            
			if ($filter_data != null) {
				$sql .= "WHERE $filter_data";
			}
			$data = array(); $errmsg = ""; $code = 0;
			try {
				if ($res = $this->pdo->query($sql)->fetchAll()) {
					foreach ($res as $rec) {
						array_push($data, $rec);
						$res = null; $code = 200;
					}
				}
			} catch(\PDOException $e) {
				$errmsg = $e->getMessage(); $code = 401;
			}
			return $this->sendPayload($data, "success", $errmsg, $code);
        }

        public function getApplicationTotalProperties($table, $filter_data){
            $sql = "SELECT COUNT(prop_id) FROM $table ";
            
			if ($filter_data != null) {
				$sql .= "WHERE $filter_data";
			}
			$data = array(); $errmsg = ""; $code = 0;
			try {
				if ($res = $this->pdo->query($sql)->fetchAll()) {
					foreach ($res as $rec) {
						array_push($data, $rec);
						$res = null; $code = 200;
					}
				}
			} catch(\PDOException $e) {
				$errmsg = $e->getMessage(); $code = 401;
			}
			return $this->sendPayload($data, "success", $errmsg, $code);
        }

        public function getApplicationTotalSales($table, $filter_data){
            $sql = "SELECT SUM(prop_price) FROM $table ";
            
			if ($filter_data != null) {
				$sql .= "WHERE $filter_data";
			}
			$data = array(); $errmsg = ""; $code = 0;
			try {
				if ($res = $this->pdo->query($sql)->fetchAll()) {
					foreach ($res as $rec) {
						array_push($data, $rec);
						$res = null; $code = 200;
					}
				}
			} catch(\PDOException $e) {
				$errmsg = $e->getMessage(); $code = 401;
			}
			return $this->sendPayload($data, "success", $errmsg, $code);
        }

        public function sendPayload($payload, $remarks, $message, $code) {
			$status = array("remarks"=>$remarks, "message"=>$message);
			http_response_code($code);
			return array(
				"status"=>$status,
				"payload"=>$payload,
				"timestamp"=>date_create());
		}
    }
?>