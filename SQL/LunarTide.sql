-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 05, 2016 at 07:23 PM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


--
-- Database: `LUNARTIDE`
--

DROP DATABASE IF EXISTS LUNARTIDE;
CREATE DATABASE LUNARTIDE;

use LUNARTIDE;


-- --------------------------------------------------------
--
-- Table structure for table `GIG_TAB`
--
CREATE TABLE IF NOT EXISTS `GIG_TAB` (
  `Id` varchar(50) NOT NULL,
  `Gig` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `SETLIST_TAB`
--
CREATE TABLE IF NOT EXISTS `SETLIST_TAB` (
  `Id` varchar(50) NOT NULL,
  `GigId` varchar(50) NOT NULL,
  `SongId` varchar(50) NOT NULL,  
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `SETLIST_TAB`
--
CREATE TABLE IF NOT EXISTS `SONG_TAB` (
  `Id` varchar(50) NOT NULL,
  `SongName` varchar(50) NOT NULL,
  `ArtistName` varchar(50) NOT NULL,    
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



--
-- Dumping data for table `GIG_TAB`, 'SETLIST_TAB' and 'SONG_TAB'
--

INSERT INTO `GIG_TAB` (`Id`, `Gig`) VALUES
('1', 'SeaWitch'),
('2', 'Halligans'),
('3', 'Smoke On The Water');

INSERT INTO `SETLIST_TAB` (`Id`, `GigId`, `SongId`) VALUES
('1', '1', '1'),
('2', '1', '3'),
('3', '2', '1'),
('4', '3', '4');


INSERT INTO `SONG_TAB` (`Id`, `SongName`, `ArtistName`) VALUES
('1', 'Last Dance', 'Tom Petty'),
('2', 'Shake It Off', 'Taylor Swift'),
('3', 'Stayin Alive', 'Bee Gees'),
('4', 'Give Me One Reason', 'Tracy Chapman');

