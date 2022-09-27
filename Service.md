# Services

## Service Management

---
### Sevice Login
```
    POST /USER/[ID]/SERVICES/CONNECT
```

#### Parameters
| Args         | Type        | Example                   |
| -----------  | ----------- | --------------------------|
| Token        | String      | `Ad6qds12qqd32`           |
| Service Name | String      | `Google`                  |

#### Response
| Args        | Type        | Example                   | optional |
| ----------- | ----------- | --------------------------|----------|
| response    | String      | `successfully login`      |   true   |
| response    | String      | `loign fail`              |   false  |

---
### Service Update

```
    PUT /USER/[ID]/SERVICE/[SERVICEID]
```

#### Parameters
| Args         | Type        | Example                   |
| -----------  | ----------- | --------------------------|
|     ...      |     ...     |  ...                      |

#### Response
| Args        | Type        | Example                   | optional |
| ----------- | ----------- | --------------------------|----------|
| response    | String      | `infos updated`           |   true   |
| response    | String      | `update fail`             |   false  |

---
### Service Disconnect

```
    DELETE  /USER/[ID]/SERVICE/[SERVICEID]/DISCONNECT
```

#### Response
| Args        | Type        | Example                   | optional |
| ----------- | ----------- | --------------------------|----------|
| response    | String      | `successful disconnect`   |   true   |
| response    | String      | `disconnect fail`         |   false  |
