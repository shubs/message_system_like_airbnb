# message_system_like_airbnb
A ReactJS + NodeJS based application which lets you handle a messaging system like Airbnb

## How to launch
```
node index.js
```
## The endpoints

```
#list messages
GET	/message/

#view a specific message
GET /message/:id

#create a message
POST /message/

#delete a message
DELETE /message/:id


```

```
edit the cred.js file like this

module.exports = {
	"MAILJET_API_KEY": "xxxxx",
	"MAILJET_SECRET_KEY": "xxxx"
}
```