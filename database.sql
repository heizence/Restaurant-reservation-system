-- 손님(customers) 테이블
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login_id` varchar(50) NOT NULL COMMENT '로그인 ID',
  `name` varchar(100) NOT NULL COMMENT '고객 이름',
  `phone_number` varchar(20) NOT NULL COMMENT '연락처',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `password` varchar(255) NOT NULL COMMENT '해시된 비밀번호',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e9d04f61d51fdbf4b084235bc0` (`login_id`),
  UNIQUE KEY `IDX_46c5f573cb24bdc6e81b8ef250` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 식당 메뉴(menus) 테이블

DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '메뉴 이름',
  `price` int NOT NULL COMMENT '가격',
  `category` varchar(50) NOT NULL COMMENT '일식, 중식, 양식 등',
  `description` text COMMENT '메뉴 설명',
  `restaurant_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_bcd4a935c967cc9c20e770d1e62` (`restaurant_id`),
  CONSTRAINT `FK_bcd4a935c967cc9c20e770d1e62` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 주문된 메뉴(reservation_menus) 테이블
DROP TABLE IF EXISTS `reservation_menus`;
CREATE TABLE `reservation_menus` (
  `reservation_id` int NOT NULL,
  `menu_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1' COMMENT '주문 수량',
  PRIMARY KEY (`reservation_id`,`menu_id`),
  KEY `FK_fe5a602a31c486a853c43aa77cd` (`menu_id`),
  CONSTRAINT `FK_bd52e865c0eac422f888a008797` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_fe5a602a31c486a853c43aa77cd` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 식당 예약(reservations) 메뉴
DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL COMMENT '예약 시작 시각',
  `end_time` datetime NOT NULL COMMENT '예약 종료 시각',
  `party_size` int NOT NULL COMMENT '예약 인원수',
  `customer_id` int NOT NULL,
  `restaurant_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_f63cb79a34cdf2d47ab23f31a8b` (`customer_id`),
  KEY `FK_ee6b00404309108652a2307c66c` (`restaurant_id`),
  CONSTRAINT `FK_ee6b00404309108652a2307c66c` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_f63cb79a34cdf2d47ab23f31a8b` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 식당(restaurants) 테이블
DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login_id` varchar(50) NOT NULL COMMENT '로그인 ID',
  `name` varchar(100) NOT NULL COMMENT '식당 이름',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `password` varchar(255) NOT NULL COMMENT '해시된 비밀번호',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_6e50de6a177df81e4f35990404` (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
