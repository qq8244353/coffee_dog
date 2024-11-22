-- 削除
DROP TABLE IF EXISTS `sales`;

-- 作成
create table IF not exists `sales`
(
 `id`                   INT(3) AUTO_INCREMENT,
 `sale_id`              INT(3) NOT NULL,
 `item_id`              INT(2) NOT NULL,
 `register_person_id`   INT(2) NOT NULL,
 `registered_at`        Datetime NOT NULL,
 `is_created`           BOOLEAN DEFAULT FALSE,
 `create_person_id`  INT(2) DEFAULT NULL,
 `created_at`       Datetime DEFAULT NULL,
 `is_handed_over`       BOOLEAN DEFAULT FALSE,
 `hand_over_person_id`  INT(2) DEFAULT NULL,
 `handed_over_at`       Datetime DEFAULT NULL,
 `is_canceled`          BOOLEAN DEFAULT FALSE,
 `cancel_person_id`     INT(2) DEFAULT NULL,
 `canceled_at`          Datetime DEFAULT NULL,
 PRIMARY KEY (`id`)
);

create table IF not exists `recieve_ids`
(
 `id` INT(2) AUTO_INCREMENT,
 `sale_id` INT(3) DEFAULT NULL,
 `available` BOOLEAN DEFAULT FALSE,
 `updated_at` Datetime DEFAULT NULL,
 PRIMARY KEY (`id`)
);
