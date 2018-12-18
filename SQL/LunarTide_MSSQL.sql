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
if not exists (select * from sysobjects where name='GIG_TAB' and xtype='U')
    create table GIG_TAB (
		Id varchar(50) NOT NULL,
		Gig varchar(500) DEFAULT NULL,
		PRIMARY KEY (Id)
    )

--
-- Table structure for table `SETLIST_TAB`
--
if not exists (select * from sysobjects where name='SETLIST_TAB' and xtype='U')
    create table SETLIST_TAB (
	Id varchar(50) NOT NULL,
	GigId varchar(50) NOT NULL,
	SongId varchar(50) NOT NULL,  
	PRIMARY KEY (Id)
    )


--
-- Table structure for table `SONG_TAB`
--
-- if not exists (select * from sysobjects where name='SONG_TAB' and xtype='U')
--     create table SONG_TAB (
-- 	Id varchar(50) NOT NULL,
-- 	SongName varchar(50) NOT NULL,
-- 	ArtistName varchar(50) NOT NULL,    
-- 	PRIMARY KEY (Id)
--     )

-- Set up ID as AutoIncrement
if not exists (select * from sysobjects where name='SONG_TAB' and xtype='U')
    create table SONG_TAB (
	ID int IDENTITY(1,1) PRIMARY KEY,	
	SongName varchar(50) NOT NULL,
	ArtistName varchar(50) NOT NULL    
    )
  




--
-- Dumping data for table `GIG_TAB`, 'SETLIST_TAB' and 'SONG_TAB'
--

INSERT INTO GIG_TAB (Id, Gig) VALUES
	('1', 'SeaWitch'),
	('2', 'Halligans'),
	('3', 'Smoke On The Water');

INSERT INTO SETLIST_TAB (Id, GigId, SongId) VALUES
	('1', '1', '1'),
	('2', '1', '3'),
	('3', '2', '1'),
	('4', '3', '4');


-- INSERT INTO SONG_TAB (Id, SongName, ArtistName) VALUES
-- 	('1', 'Last Dance', 'Tom Petty'),
-- 	('2', 'Shake It Off', 'Taylor Swift'),
-- 	('3', 'Stayin Alive', 'Bee Gees'),
-- 	('4', 'Give Me One Reason', 'Tracy Chapman');

-- Set up ID as AutoIncrement
DBCC CHECKIDENT ('[SONG_TAB]', RESEED, 0);
INSERT INTO SONG_TAB (SongName, ArtistName) VALUES
	( 'Last Dance', 'Tom Petty'),
	( 'Shake It Off', 'Taylor Swift'),
	( 'Stayin Alive', 'Bee Gees'),
	( 'Give Me One Reason', 'Tracy Chapman');


