# Account

## Account management

---
### register request
```
    POST /register
```

#### parameters
| Args        | Type        | Example                   |
| ----------- | ----------- | --------------------------|
| Username    | String      | `ardur`                   |
| Email       | String      | `ardur.duhot@epitech.eu`  |
| Password    | String      | `petitchaton`             |

#### response
| Args        | Type        | Example                   | optional |
| ----------- | ----------- | --------------------------|----------|
| response    | String      | `register successfuly`    |   true   |
| response    | String      | `register fail`           |   false  |

---
### login request

```
    GET /LOGIN
```

#### parameters
| Args        | Type        | Example                   |
| ----------- | ----------- | --------------------------|
| Email       | String      | `ardur.duhot@epitech.eu`  |
| Password    | String      | `petitchaton`             |

### response
| Args        | Type        | Example                   | optional |
| ----------- | ----------- | --------------------------|----------|
| response    | String      | `successfuly login`       |   true   |
| response    | String      | `login fail`              |   false  |


---
### Update request

```
    PUT /USR/$(ID)/UDPATE
```

### parameters

| Args        | Type        | Example                   |
| ----------- | ----------- | --------------------------|
| Username    | String      | `yoanndure`               |
| Email       | String      | `yoann.elasmar@epitech.eu`|
| Password    | String      | `groschaton`              |


### response
| Args        | Type        | Example                   | optional |
| ----------- | ----------- | --------------------------|----------|
| response    | String      | `infos update successfuly`|   true   |
| response    | String      | `update fail`             |   false  |
