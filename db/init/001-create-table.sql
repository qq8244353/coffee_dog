-- 削除
DROP TABLE IF EXISTS `sales`;

-- 作成
create table IF not exists `sales`
(
 `sale_id`              INT(3) AUTO_INCREMENT,
 `item_id`              INT(1) NOT NULL,
 `register_person_id`   INT(2) NOT NULL,
 `registered_at`        Datetime NOT NULL,
 `is_handed_over`       BOOLEAN DEFAULT FALSE,
 `hand_over_person_id`  INT(2) DEFAULT NULL,
 `handed_over_at`       Datetime DEFAULT NULL,
 `is_canceled`          BOOLEAN DEFAULT FALSE,
 `cancel_person_id`     INT(2) DEFAULT NULL,
 `canceled_at`          Datetime DEFAULT NULL,
 PRIMARY KEY (`sale_id`)
);

-- 追加
