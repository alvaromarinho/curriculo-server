CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `img_url` varchar(255) DEFAULT '/assets/img/default_user.png',
  `city` varchar(100) NOT NULL,
  `uf` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`));

CREATE TABLE `alvin`.`phones` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `number` VARCHAR(45) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_phones_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_phones_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `alvin`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `alvin`.`social_networks` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `icon` VARCHAR(45) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_social_networks_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_social_networks_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `alvin`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `alvin`.`informations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `description` LONGTEXT NULL,
  `type` VARCHAR(45) NOT NULL,
  `start` DATETIME NOT NULL,
  `end` DATETIME NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_informations_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_informations_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `alvin`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `alvin`.`skill_groups` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_skill_groups_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_skill_groups_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `alvin`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `alvin`.`skills` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `icon` VARCHAR(45) NOT NULL,
  `group_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_skills_skill_group_idx` (`group_id` ASC),
  CONSTRAINT `fk_skills_skill_group`
    FOREIGN KEY (`group_id`)
    REFERENCES `alvin`.`skill_groups` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `alvin`.`portfolios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_portfolios_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_portfolios_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `alvin`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `alvin`.`projects` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `description` LONGTEXT NULL,
  `url` VARCHAR(255) NULL,
  `portfolio_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_projects_portfolio_idx` (`portfolio_id` ASC),
  CONSTRAINT `fk_projects_portfolio`
    FOREIGN KEY (`portfolio_id`)
    REFERENCES `alvin`.`portfolios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `alvin`.`project_images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `url` VARCHAR(255) NOT NULL,
  `project_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_project_images_project_idx` (`project_id` ASC),
  CONSTRAINT `fk_project_images_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `alvin`.`projects` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
