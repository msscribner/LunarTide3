--
-- Database: `LUNARTIDE`
--

DROP DATABASE IF EXISTS LUNARTIDE;
CREATE DATABASE LUNARTIDE;

use LUNARTIDE;


-- --------------------------------------------------------
--
-- Table structure for table `GIG_TAB`
-- --------------------------------------------------------
if not exists (select * from sysobjects where name='GIG_TAB' and xtype='U')
    create table GIG_TAB (
		Id int IDENTITY(1,1) PRIMARY KEY,	
		GigName varchar(50) DEFAULT NULL
    )

-- --------------------------------------------------------
-- Table structure for table `SETLIST_TAB`
-- --------------------------------------------------------
if not exists (select * from sysobjects where name='SETLIST_TAB' and xtype='U')
    create table SETLIST_TAB (
	Id int IDENTITY(1,1) PRIMARY KEY,	
	GigId varchar(50) NOT NULL,
	SongId varchar(50) NOT NULL  
    )

-- --------------------------------------------------------
-- Table structure for table `SONG_TAB`
-- --------------------------------------------------------
if not exists (select * from sysobjects where name='SONG_TAB' and xtype='U')
    create table SONG_TAB (
	ID int IDENTITY(1,1) PRIMARY KEY,	
	SongName varchar(50) NOT NULL,
	ArtistName varchar(50) NOT NULL    
    )
  




--
-- Dumping data for table `GIG_TAB`, 'SETLIST_TAB' and 'SONG_TAB'
--

-- Reset up ID as AutoIncrement
DBCC CHECKIDENT ('[GIG_TAB]', RESEED, 0);
DBCC CHECKIDENT ('[SETLIST_TAB]', RESEED, 0);
DBCC CHECKIDENT ('[SONG_TAB]', RESEED, 0);


INSERT INTO GIG_TAB (GigName) VALUES
	( 'SeaWitch'),
	( 'Halligans'),
	( 'Smoke On The Water'),
	( 'Private');

INSERT INTO SETLIST_TAB (GigId, SongId) VALUES
	( '1', '1'),
	( '1', '3'),
	( '2', '1'),
	( '3', '4');

INSERT INTO SONG_TAB (SongName, ArtistName) VALUES
	( 'Last Dance', 'Tom Petty'),
	( 'Shake It Off', 'Taylor Swift'),
	( 'Stayin Alive', 'Bee Gees'),
	( 'Give Me One Reason', 'Tracy Chapman');


