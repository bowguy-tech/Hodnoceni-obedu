-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema wa_projekt
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema wa_projekt
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `wa_projekt` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `wa_projekt` ;

-- -----------------------------------------------------
-- Table `wa_projekt`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wa_projekt`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(100) NOT NULL,
  `Created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_name` (`Name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `wa_projekt`.`feedback`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wa_projekt`.`feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `users_id` INT NULL DEFAULT NULL,
  `image` VARCHAR(50) NULL DEFAULT NULL,
  `time_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rating` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_feedback_Users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_feedback_Users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `wa_projekt`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `wa_projekt`.`meals`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wa_projekt`.`meals` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255) NULL DEFAULT NULL,
  `Type` VARCHAR(255) NULL DEFAULT NULL,
  `Description` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 52
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `wa_projekt`.`menu`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wa_projekt`.`menu` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `date` (`date` ASC) VISIBLE,
  UNIQUE INDEX `date_2` (`date` ASC) VISIBLE,
  UNIQUE INDEX `date_3` (`date` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 140
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `wa_projekt`.`item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wa_projekt`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Meals_id` INT NOT NULL,
  `Menu_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_item_Meals1_idx` (`Meals_id` ASC) VISIBLE,
  INDEX `fk_item_Menu1_idx` (`Menu_id` ASC) VISIBLE,
  CONSTRAINT `fk_item_Meals1`
    FOREIGN KEY (`Meals_id`)
    REFERENCES `wa_projekt`.`meals` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_item_Menu1`
    FOREIGN KEY (`Menu_id`)
    REFERENCES `wa_projekt`.`menu` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 96
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `wa_projekt`.`ratings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wa_projekt`.`ratings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `User_id` INT NOT NULL,
  `Portion_size` INT NOT NULL,
  `Food_temperature` INT NOT NULL,
  `Willing_to_pay` INT NOT NULL,
  `Food_appearance` INT NOT NULL,
  `Created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Item_id` INT NOT NULL,
  `image` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`User_id` ASC) VISIBLE,
  INDEX `fk_Ratings_Item1_idx` (`Item_id` ASC) VISIBLE,
  CONSTRAINT `fk_Ratings_Item1`
    FOREIGN KEY (`Item_id`)
    REFERENCES `wa_projekt`.`item` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ratings_user`
    FOREIGN KEY (`User_id`)
    REFERENCES `wa_projekt`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `wa_projekt` ;

-- -----------------------------------------------------
-- procedure AddFeedback
-- -----------------------------------------------------

DELIMITER $$
USE `wa_projekt`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddFeedback`(in usern varchar(50), in tit varchar(50), in descr varchar(400),in img varchar(50),in rat int)
BEGIN
	insert into feedback(users_id,name,description,image,rating) values ((select id from users where (name = usern)),tit,descr,img,rat);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure AddItemToMenu
-- -----------------------------------------------------

DELIMITER $$
USE `wa_projekt`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddItemToMenu`(
    IN mealName VARCHAR(255),
    IN mealType VARCHAR(255),
    IN mealDescription VARCHAR(255),
    IN menuDate DATE
)
BEGIN
    DECLARE mealId INT;
    DECLARE menuId INT;

    SELECT id INTO mealId FROM Meals WHERE Name = mealName LIMIT 1;

    IF mealId IS NULL THEN
        INSERT INTO Meals (Name, Type, Description)
        VALUES (mealName, mealType, mealDescription);

        SET mealId = LAST_INSERT_ID();
    END IF;

    SELECT id INTO menuId FROM Menu WHERE date = menuDate LIMIT 1;

    IF menuId IS NULL THEN
        INSERT INTO Menu (date) VALUES (menuDate);
        SET menuId = LAST_INSERT_ID();
    END IF;

    INSERT INTO Item (Meals_id, Menu_id) VALUES (mealId, menuId);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure AddMenu
-- -----------------------------------------------------

DELIMITER $$
USE `wa_projekt`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddMenu`(
    IN menuDate DATE
)
BEGIN
	insert into menu(date) values (menuDate);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure AddRating
-- -----------------------------------------------------

DELIMITER $$
USE `wa_projekt`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddRating`(
    IN userName VARCHAR(100),
    IN itemId INT,
    IN portionSize INT,
    IN foodTemperature INT,
    IN willingToPay INT,
    IN foodAppearance INT,
    IN imageFileName VARCHAR(255)
)
BEGIN
    DECLARE userId INT;
    DECLARE existingRating INT;

    -- Get the user ID from the username
    SELECT id INTO userId FROM Users WHERE Name = userName LIMIT 1;

    -- Check if the user already rated this item
    SELECT id INTO existingRating FROM Ratings WHERE User_id = userId AND Item_id = itemId LIMIT 1;

    -- If a rating already exists, prevent insertion
    IF existingRating IS NULL THEN
        INSERT INTO Ratings (User_id, Item_id, Portion_size, Food_temperature, Willing_to_pay, Food_appearance, Created_at, image)
        VALUES (userId, itemId, portionSize, foodTemperature, willingToPay, foodAppearance, NOW(), imageFileName);
    END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GetFeedback
-- -----------------------------------------------------

DELIMITER $$
USE `wa_projekt`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFeedback`()
BEGIN
    select
		u.name,
		f.name as title,
		f.description,
		f.image,
		f.time_created,
        f.rating
	from feedback f
		inner join users u on u.id = f.users_id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GetFoodCatalog
-- -----------------------------------------------------

DELIMITER $$
USE `wa_projekt`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFoodCatalog`()
BEGIN
	select
		m.name,
		m.description,
		avg(Portion_size) as size,
		avg(Food_temperature) as temperature,
		avg(Willing_to_pay) as worth,
		avg(Food_appearance) as appearance,
		count(r.id) as 'unmber of ratings'
	from meals m
		left join ratings r on r.Item_id = m.id
	group by
		m.name,
		m.Description;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getItem
-- -----------------------------------------------------

DELIMITER $$
USE `wa_projekt`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getItem`(
	id int
)
BEGIN
	select
		Name,
		type,
		date
	from item
		inner join meals on meals.id = meals_id
		inner join menu on menu.id = Menu_id
    where item.id = id;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getMenu
-- -----------------------------------------------------

DELIMITER $$
USE `wa_projekt`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getMenu`(
    IN p_username VARCHAR(255),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    -- Create a temporary table to hold the distinct dates with the applied limit and offset
    CREATE TEMPORARY TABLE temp_dates AS
    SELECT DISTINCT mn.date
    FROM menu mn
    ORDER BY mn.date DESC
    LIMIT p_limit OFFSET p_offset;

    -- Now select the menu items based on the distinct dates in the temporary table
    SELECT
        mn.date AS date,
        i.id,
        m.Name AS name,
        m.Type AS type,
        m.Description AS description,
        (SELECT AVG(r.Portion_size) FROM ratings r WHERE r.Item_id = i.id) AS portion,
        (SELECT AVG(r.Food_temperature) FROM ratings r WHERE r.Item_id = i.id) AS temperature,
        (SELECT AVG(r.Willing_to_pay) FROM ratings r WHERE r.Item_id = i.id) AS worth,
        (SELECT AVG(r.Food_appearance) FROM ratings r WHERE r.Item_id = i.id) AS food_appearance,
        (SELECT GROUP_CONCAT(r.image ORDER BY r.Created_at DESC SEPARATOR ', ')
         FROM ratings r WHERE r.Item_id = i.id LIMIT 3) AS images,
        -- Check if the user has already rated the food item
        IF(EXISTS (SELECT 1
                   FROM ratings r
                   WHERE r.Item_id = i.id
                   AND r.user_id = (SELECT id FROM users WHERE name = p_username)), 1, 0) AS has_rated
    FROM
        item i
    JOIN
        meals m ON i.Meals_id = m.id
    JOIN
        menu mn ON i.Menu_id = mn.id
    JOIN
        temp_dates td ON mn.date = td.date
    ORDER BY
        mn.date DESC, i.id; -- Order by date and item ID

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_dates;
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
