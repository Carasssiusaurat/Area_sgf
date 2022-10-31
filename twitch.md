# Services

## Service Management

---
### GET USER
```
    GET /twitch/users?login=twitchdev
```

##### return value:
#
```
{
  "data": [
    {
      "broadcaster_type": "partner",
      "created_at": "2021-07-30T20:32:28Z",
      "description": "Supporting third-party developers building Twitch integrations from chatbots to game integrations.",
      "display_name": "TwitchDev",
      "id": "141981764",
      "login": "twitchdev",
      "type": "",
      "view_count": 6652509
    }
  ]
}
```
---
## GET STREAMERS
---
### List of streams
```
    GET twitch/streams
```
#### Return value: Streams sorted by numbers of current viewers
##### Streams
#
| FIELD         | DATA TYPE        | DESCRIPTION                   |
| -----------  | ----------- | --------------------------|
| id             |     String     |  Stream ID|
| user_id  |     String     |  ID of the user who is streaming|
| user_login               |     String     |  Login of the user who is streaming |
| user_name  |     String     | Display name corresponding to user_id|
| game_id  |     String     |  ID of the game being played on the stream    |
| game_name  |     String     |  Name of the game being played      |
| type  |     String     |  Stream type: "live" or "" (in case of error)    |
| title  |     String     | Stream title                   |
| viewer_count  |     Int     |  Number of viewers watching the stream at the time of the query          |
| started_at  |     String     | UTC timestamp                   |
| language  |     String     |  Stream language. A language value is either the ISO 639-1 two-letter code for a supported stream language or “other"                     |
| thumbnail_url  |     String     |  Thumbnail URL of the stream. All image URLs have variable width and height. You can replace {width} and {height} with any values to get that size image                     |
| tag_ids  |     String     | Shows tag IDs that apply to the stream    |
| is_mature  |     Boolean     |  Indicates if the broadcaster has specified their channel contains mature content that may be inappropriate for younger audiences|
| pagination  |     Object containing a string     |  A cursor value, to be used in a subsequent request to specify the starting point of the next set of results              |
#
---
## GET FOLLOWING STREAMERS
---
### List of following streams
```
    GET twitch/streams/followed
```
#### Requirements
```
    scope needed: user:read:follows
    OAuth user token required
```
##### Required Query Parameters
#
| NAME  | TYPE | Description | 
| ----------- | ----------- | -- |
| user_id | String      | Results will only include active streams from the channels that this Twitch user follows. user_id must match the User ID in the bearer token |
##### Optional Query Parameters
#
| NAME  | TYPE | Description | 
| ----------- | ----------- | -- |
| after | String      | Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query |
|first |int | Maximum number of objects to return. Maximum: 100. Default: 100|
##### Response Fields
#
| FIELD | TYPE | DESCRIPTION |
| -- | -- | --- |
| game_id    | Unauthorized      | ID of the game being played on the stream |
| game_name    | Forbidden      |Name of the game being played|
| id    | Data not found      |Stream ID|
| language    |  Method not allowed     |Stream language. A language value is either the ISO 639-1 two-letter code for a supported stream language or “other”|
| pagination   | Unsupported media type      |A cursor value, to be used in a subsequent request to specify the starting point of the next set of results|
| started_at| Rate limit exceeded      |UTC timestamp|
| tag_ids| Internal server error      |Shows tag IDs that apply to the stream|
| thumbnail_url| Bad gateway      |Thumbnail URL of the stream. All image URLs have variable width and height. You can replace {width} and {height} with any values to get that size image|
| title    | Service unavailable      |Stream title|
| type  | Gateway timeout      |Stream type: "live" or "" (in case of error)|
| user_id  | Gateway timeout      |ID of the user who is streaming|
| user_login | Gateway timeout      |Login of the user who is streaming|
| user_name  | Gateway timeout      |Display name corresponding to user_id|
| viewer_count  | Gateway timeout      |Number of viewers watching the stream at the time of the query|