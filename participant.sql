-- phpMyAdmin SQL Dump
-- version 2.11.8.1deb5+lenny6
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- GÃ©nÃ©rÃ© le : Dim 24 Octobre 2010 Ã  21:46
-- Version du serveur: 5.0.51
-- Version de PHP: 5.2.6-1+lenny9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de donnÃ©es: `webperf_contest`
--

-- --------------------------------------------------------

--
-- Structure de la table `participant`
--

CREATE TABLE IF NOT EXISTS `participant` (
  `participant_id` mediumint(9) NOT NULL auto_increment,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `gist` varchar(255) NOT NULL,
  `website` varchar(255) NOT NULL,
  `twitter` varchar(255) NOT NULL,
  `language` enum('eng','fra') NOT NULL default 'eng',
  `admin` enum('pick','vvo','eda','jpv') NOT NULL default 'pick' COMMENT 'pick signifie "prenez le si vous avez le temps"',
  `date_of_register` datetime NOT NULL,
  `login_sent` tinyint(1) NOT NULL default '0',
  `uniqid` varchar(255) NOT NULL,
  PRIMARY KEY  (`participant_id`),
  UNIQUE KEY `uniqid` (`uniqid`),
  UNIQUE KEY `email` (`email`),
  KEY `name` (`name`)
) ENGINE=MyISAM  CHARACTER SET utf8 COLLATE utf8_general_ci