# Services

## Service Management

---
### ACCOUNT BY RIOT ID
```
    GET /riot/account/by-riot-id/{gameName}/{tagLine}
```

##### return value: AccountDto
#
#### AccountDto
| NAME      | DATA TYPE | DESCRIPTION               |
| --------- | --------- | ------------------------- |
| puuid     | string    |                           |
| gameName  | String    | `This field may be excluded from the response if the account doesn't have a gameName.` |
| tagLine   | String    | `This field may be excluded from the response if the account doesn't have a tagLine. ` |
---
#### Response Errors
| HTTP Status Code  | Reason | 
| ----------- | ----------- |
| 400    | Bad request      |
| 401    | Unauthorized      |
| 403    | Forbidden      |
| 404    | Data not found      |
| 405    |  Method not allowed     |
| 415    | Unsupported media type      |
| 429    | Rate limit exceeded      |
| 500    | Internal server error      |
| 502    | Bad gateway      |
| 503    | Service unavailable      |
| 504    | Gateway timeout      |

#### PATH PARAMETERS
| NAME | VALUE | DATA TYPE  | DESCRIPTION |
| ---- | ----- | ---------- | ----------- |
| TagLine | [`value`] | String | `When querying for a player by their riot id, the gameName and tagLine query params are required. However not all accounts have a gameName and tagLine associated so these fields may not be included in the response.` |
| GameName | [`value`] | String | `When querying for a player by their riot id, the gameName and tagLine query params are required. However not all accounts have a gameName and tagLine associated so these fields may not be included in the response.` |
#
---
## ROTATION
---
### CHAMPION ROTATION
```
    GET /riot/lol/champion-rotations
```
#### Return value: Champion info
##### ChampionInfo
#
| Name         | DATA TYPE        | DESCRIPTION                   |
| -----------  | ----------- | --------------------------|
| maxNewPlayerLevel             |     int     |  ...                      |
| freeChampionIdsForNewPlayers  |     List[int]     |  ...                      |
| freeChampionIds               |     List[int]     |  ...                      |
---
#### Response
| HTTP Status Code  | Reason | 
| ----------- | ----------- |
| 400    | Bad request      |
| 401    | Unauthorized      |
| 403    | Forbidden      |
| 404    | Data not found      |
| 405    |  Method not allowed     |
| 415    | Unsupported media type      |
| 429    | Rate limit exceeded      |
| 500    | Internal server error      |
| 502    | Bad gateway      |
| 503    | Service unavailable      |
| 504    | Gateway timeout      |