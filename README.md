# Mr Musicphile - Actions on Google

<img src="./repo_images/google_assistant_logo.svg?sanitize=true" height="80"> 

<img src="./repo_images/ic_launcher.png" height="80">

Mr Musicphile is an agent to find information about artists, lyrics, artists songs that contain a specific word, songs by feels and songs by genres. Developed using Dialogflow and Cloud Functions.

- **Languages:** Spanish and English

## Use cases

### Information about an artist

Retrieves information about an artist. The information is extracted from Last.fm using the API.

#### Phrases

- I want information about artist
- Information about the artist artist
- Give information about artist

<img src="./repo_images/artist_information.png" height="480">

### Lyrics

Uses Genius API and Web Scraping to get the lyrics.

#### Phrases

- I want the lyrics of track by group
- I want the lyrics of track
- Search the lyrics of track
- Give me the lyrics of track

<img src="./repo_images/song_lyrics.png" height="480">

### Songs by genre

#### Phrases

- Songs of genre

<img src="./repo_images/songs_genre.png" height="480"> <img src="./repo_images/songs_genre_1.png" height="480">

### Songs of an artist that contain a specific term

For this use case, it's used the Musixmatch API

#### Phrases

- Songs by group that have the word word
- I want songs by group that have the word word

<img src="./repo_images/songs_group_word.png" height="480">
