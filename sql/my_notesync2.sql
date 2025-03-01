DROP DATABASE IF EXISTS my_notesync2;
CREATE DATABASE my_notesync2;

USE my_notesync2;

CREATE TABLE `action_logs` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `text` varchar(255) NOT NULL,
  `points` int(11) NOT NULL,
  `target` varchar(50) NOT NULL,
  `typeAction` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `action_logs` (`id`, `username`, `text`, `points`, `target`, `typeAction`, `active`) VALUES
(25, 'Pippo', 'Se qualcuno dei giocatori perde la pazienza', -10, 'all', 'aggiungi', 1),
(26, 'Pippo', 'Japa dice “caso chiuso”', 5, 'all', 'aggiungi', 1);



CREATE TABLE `users` (
  `name` varchar(80) NOT NULL,
  `score` int(10) NOT NULL,
  `role` varchar(80) NOT NULL,
  `members` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO `users` (`name`, `score`, `role`, `members`) VALUES
('Pippo', 0, 'mod', 'japa.chiara.Nome1.Nome2.Nom3.filippo'),
('Array', 0, 'user', ''),
('Bartolomeo', 0, 'user', 'Ingrippao.Gatto.Zuzi.Juri.Crimi.Horit'),
('Salvo', 0, 'user', 'Lissa.Zuzi.Dark.Gatto.Pippo.Crimi'),
('Bartolomeo', 0, 'user', ''),
('pippo', 0, 'user', ''),
('swwws', 0, 'user', 'Pippo.Crimi.Horit.Nome11.Nome14.Ciao');


ALTER TABLE `action_logs`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `action_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;




CREATE USER 'fantajapa'@'localhost' IDENTIFIED BY 'ciaociao88';
GRANT ALL PRIVILEGES ON *.* TO 'fantajapa'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

COMMIT;
