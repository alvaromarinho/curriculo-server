# alvin-server

 - USER
 	id
 	name
 	description
 	email
 	img_url
 	city
 	uf
 	password

- PHONE
	id
	number
	user_id
	
- SOCIAL NETWORK
	id
	name
	icon
	url
	user_id
	
- INFORMATION
	id
	title
	subtitle
	description
	type
	user_id
	start
	end

- SKILL
	id
	name
	icon	
	group_id
		
- GROUP
	id
	name
	user_id
	
- PROJECT
	id
	title
	subtitle
	description
	url
	portfolio_id

- PROJECT_IMAGE
	id
	name
	url
	project_id
	
- PORTFOLIO
	id
	name
	user_id
	
	
	DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `img_url` varchar(255) DEFAULT '/assets/img/default_user.png',
  `city` varchar(100) NOT NULL,
  `uf` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
	
