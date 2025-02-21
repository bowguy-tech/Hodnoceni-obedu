CREATE SCHEMA IF NOT EXISTS `WA_projekt`;
USE `WA_projekt`;

DROP TABLE IF EXISTS `Users`;
CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(100) NOT NULL,
  `Created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_name` (`Name`)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS `Meals`;
CREATE TABLE IF NOT EXISTS `Meals` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255) NULL DEFAULT NULL,
  `Type` VARCHAR(255) NULL DEFAULT NULL,
  `Description` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS `Menu`;
CREATE TABLE IF NOT EXISTS `Menu` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS `Item`;
CREATE TABLE IF NOT EXISTS `Item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Meals_id` INT NOT NULL,
  `Menu_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_item_Meals1_idx` (`Meals_id`),
  INDEX `fk_item_Menu1_idx` (`Menu_id`),
  CONSTRAINT `fk_item_Meals1` FOREIGN KEY (`Meals_id`) REFERENCES `Meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_item_Menu1` FOREIGN KEY (`Menu_id`) REFERENCES `Menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

DROP TABLE IF EXISTS `Ratings`;
CREATE TABLE IF NOT EXISTS `Ratings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `User_id` INT NOT NULL,
  `Portion_size` INT NOT NULL,
  `Food_temperature` INT NOT NULL,
  `Willing_to_pay` INT NOT NULL,
  `Food_appearance` INT NOT NULL,
  `Created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Item_id` INT NOT NULL,
  `img_location` VARCHAR(255) NULL,
  `img_name` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`User_id`),
  INDEX `fk_Ratings_Item1_idx` (`Item_id`),
  CONSTRAINT `fk_ratings_user` FOREIGN KEY (`User_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Ratings_Item1` FOREIGN KEY (`Item_id`) REFERENCES `Item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_Portion_size` CHECK (`Portion_size` BETWEEN 1 AND 5),
  CONSTRAINT `chk_Food_temperature` CHECK (`Food_temperature` BETWEEN 1 AND 5),
  CONSTRAINT `chk_Willing_to_pay` CHECK (`Willing_to_pay` BETWEEN 1 AND 5),
  CONSTRAINT `chk_Food_appearance` CHECK (`Food_appearance` BETWEEN 1 AND 5)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `description` VARCHAR(255) NULL,
  `Users_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_feedback_Users1_idx` (`Users_id`),
  CONSTRAINT `fk_feedback_Users1` FOREIGN KEY (`Users_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

DROP TABLE IF EXISTS `img`;
CREATE TABLE IF NOT EXISTS `img` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `location` VARCHAR(255) NULL,
  `feedback_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_img_feedback1_idx` (`feedback_id`),
  CONSTRAINT `fk_img_feedback1` FOREIGN KEY (`feedback_id`) REFERENCES `feedback` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;
