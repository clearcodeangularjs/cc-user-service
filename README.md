Clearcode User Service
=========

Service for providing user data, storing them on localStorage.
Installation
--------------
TODO


Usage
------

Add ``` cc.cc.user.service ``` module to your app module list :


```
angular
    .module('yourAwesomeApp', [
        'cc.user.service'
    ]);
```
and you are ready to go!

How to use service methods:

*UserServ.register*

```
UserServ.register(data); // -> sets user data into localStorage

```

*UserServ.registerTemporary*

```
UserServ.registerTemporary(data); // -> sets temporarly user data (not in localStorage)

```


*UserServ.unregister*

```
UserServ.unregister(); // -> deletes user data from local storage

```

*UserServ._save*

```
UserServ._save(); // -> saves temporary user data into localStorage
```

*UserServ.isRegistered*

```
UserServ.isRegistered(); // -> returns if user data is stored into localStorage

```

*UserServ.read*

```
UserServ.read(field); // -> returns user field

```


*UserServ.getEmail*

```
UserServ.getEmail(); // -> shortcut for email

```


*UserServ.getId*

```
UserServ.getId(); // -> shortcut for id

```


*UserServ.getDateRange*

```
UserServ.getDateRange(); // -> shortcut for dateRange

```

*UserServ.getToken*

```
UserServ.getToken(); // -> shortcut for token

```


*UserServ.setDateRange*

```
UserServ.setDateRange(range); // -> sets date range for user

```

Author
------

Pawel Galazka


License
----

LGPL

